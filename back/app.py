from flask import Flask,request,jsonify
from flask_cors import CORS
import json
import random
import string
import pandas as pd
import numpy as np
import pickle
import  requests
import warnings
from service.getMatchInfo import fetch_contest_lists
from service.selectMatchInfo import fetch_paginated_data
from  dealData.addID import addId
from dealData.insertMatchInfoToDatabase import store_data_to_mysql
from service.uerCountService import handle_login,handle_register
import os
warnings.filterwarnings('ignore')
app = Flask(__name__)
CORS(app)

#获取竞赛信息数据,获取到的数据分块先以csv形式存入data目录下
@app.route('/api/syncMatchInfo', methods=['GET'])
def sync_match_info():
    matchInfo = []
    file_counter = 1  # 文件计数器
    output_dir = './data/'

    try:
        # 循环请求第1页到第826页的数据
        for page in range(1, 11):
            current_page = page
            res = fetch_contest_lists(page=page, limit=10)
            matchInfo.extend(res)  # 将每页的数据添加到总列表中

            if page % 10 == 0:
                print(f'已完成{page}页')

        df = pd.DataFrame(matchInfo)
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        # 重命名rank列
        df.columns = [
            "ranking" if col == "rank" else col
            for col in df.columns
        ]
        df.to_csv(f'{output_dir}data.csv', index=False, encoding='utf-8-sig')
        print(f"数据已成功保存到{output_dir}data.csv")

        # 读取写入的数据
        data = pd.read_csv('./data/data.csv')
        # 添加ID字段后写回
        addId(data=data,savePath='./data/')
        # 读取拥有ID的数据集
        data = pd.read_csv('./data/data_with_id.csv')
        # 　写入数据库
        store_data_to_mysql(data)

        responses = {
            'data': [{'code': 200, 'result': 'succeed'}]
        }
        return jsonify(responses)

    except Exception as e:
        print(f"调用过程中发生错误 (页码: {current_page}): {e}")
        responses = {
            'error': str(e)
        }
        return jsonify(responses), 500

# 按照类型，级别进行筛选比赛以及排序
@app.route('/api/getMatchInfo',methods=['GET'])
def get_match_info ():
    # 从URL参数中获取limit和page，设置默认值为10和1
    limit = request.args.get('limit', default=10, type=int) # 每页条数
    page = request.args.get('page', default=1, type=int) # 页码
    class_id = request.args.get('class_id',default='',type=str) # 类别
    level = request.args.get('level',default=0,type=int) # 级别
    sort = request.args.get('sort', default=None, type=int) # 排序
    try:
        data = fetch_paginated_data(limit=limit,page=page,class_id=class_id,level=level,sort=sort)
        return jsonify(data)
    except Exception as e:
        return jsonify(structured_data = {
        "code": 200,
        "msg": str(e),
    })

# 登录接口
@app.route('/api/login',methods=['post'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    return handle_login(email, password)

# 注册接口
@app.route('/api/register',methods=['post'])
def register():
    email = request.json.get('email')
    password = request.json.get('password')
    username = request.json.get('username')
    return  handle_register(username,password,email)

if __name__ == '__main__':
    app.run(debug=True,port=8444)