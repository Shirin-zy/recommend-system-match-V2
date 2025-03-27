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
import os
warnings.filterwarnings('ignore')
app = Flask(__name__)
CORS(app)

#获取竞赛信息数据,获取到的数据分块先以csv形式存入data目录下
@app.route('/api/syncMatchInfo', methods=['GET'])
def sync_match_info():
    matchInfo = []
    file_counter = 1  # 文件计数器
    batch_size = 100  # 每100页保存一次数据
    current_page = 0  # 当前处理的页码

    try:
        # 循环请求第1页到第826页的数据
        for page in range(1, 827):
            current_page = page
            res = fetch_contest_lists(page=page, limit=10)
            matchInfo.extend(res)  # 将每页的数据添加到总列表中

            if page % 10 == 0:
                print(f'已完成{page}页')

            # 每100页保存一次数据
            if page % batch_size == 0 or page == 826:
                df = pd.DataFrame(matchInfo)
                output_dir = './data'
                if not os.path.exists(output_dir):
                    os.makedirs(output_dir)
                output_file = os.path.join(output_dir, f'matchInfo{file_counter}.csv')
                df.to_csv(output_file, index=False, encoding='utf-8-sig')
                print(f"数据已成功保存到 {output_file}")
                matchInfo.clear()  # 清空列表以便开始新的批次
                file_counter += 1

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


@app.route('/api/getMatchInfo',methods=['GET'])
def get_match_info ():
    # 从URL参数中获取limit和page，设置默认值为10和1
    limit = request.args.get('limit', default=10, type=int) # 每页条数
    page = request.args.get('page', default=1, type=int) # 页码
    class_id = request.args.get('class_id',default='',type=str) # 类别
    level = request.args.get('level',default=0,type=int) # 级别
    sort = request.args.get('sort', default=0, type=int) # 排序
    print(f'limit: {limit}\npage: {page}\nclass_id: {class_id}\nlevel: {level}\nsort: {sort}')
    try:
        data = fetch_paginated_data(limit=limit,page=page,class_id=class_id,level=level,sort=sort)
        return jsonify(data)
    except Exception as e:
        return jsonify(structured_data = {
        "code": 200,
        "msg": str(e),
    })
if __name__ == '__main__':
    app.run(debug=True,port=8444)