from flask import Flask, render_template
from flask_sock import Sock  # 导入Flask-Sock
from threading import Thread
from service.getMatchInfo import fetch_contest_lists
from dealData.mregeWithData import mergeWithData
from dealData.addID import addId
from dealData.insertMatchInfoToDatabase import store_data_to_mysql
from service.systemInfo import systemInfo
import pandas as pd
import os
import time
import json

app = Flask(__name__)
sock = Sock(app)

# 更新竞赛数据
def background_task(ws):
    total = 10 #　获取页数
    matchInfo = [] # 总数据
    for page in range(1,11):
        current_page = page
        res = fetch_contest_lists(page=page,limit=10)
        matchInfo.extend(res)
        if page%10==0:
            print(f'已完成{page}页')
        progress = (current_page) * 100 / total
        ws.send(progress)
    df = pd.DataFrame(matchInfo)
    if not os.path.exists('./data'):
        os.makedirs('./data')
    # 重命名rank列
    df.columns = [
        "ranking" if col == "rank" else col
        for col in df.columns
    ]
    # 读取旧数据
    oldData = pd.read_csv('./data/data.csv')
    # 在新获取的数据中筛选出老数据集中不存在的进行添加并写入
    mergeWithData(data=df,oldData=oldData,savePath='./data/')
    # 再次读取出data
    data = pd.read_csv('./data/data.csv')
    #　为其添加ID列并写入
    addId(data=data,savePath='./data/')
    # 读取拥有ID的数据集
    data = pd.read_csv('./data/data_with_id.csv')
    #　写入数据库
    store_data_to_mysql(data)
    # 发送进度到前端
    ws.send("complete")  # 任务完成标识

# 新增一个后台线程用于定期发送系统状态
def send_system_status(ws):
    while True:
        sys_info = systemInfo()
        ws.send(json.dumps(sys_info))  # 发送系统信息到前端
        time.sleep(1)  # 每10秒发送一次

# 新增 WebSocket 接口，用于监听系统状态
@sock.route('/systemStatus')
def system_status(ws):
    # 启动后台线程定期发送系统状态
    thread = Thread(target=send_system_status, args=(ws,))
    thread.daemon = True
    thread.start()
    # 防止主线程提前退出
    thread.join()

# 定义 WebSocket 接口，webscoket请求，方便持续获取更新进度
@sock.route('/progress')
def progress(ws):
    # 启动后台线程执行任务
    thread = Thread(target=background_task, args=(ws,))
    thread.daemon = True
    thread.start()
    # 防止主线程提前退出
    thread.join()

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)