# 读取data数据并为其添加一个ID字段
import pandas as pd
import numpy as np

def addId(data,savePath):
    # 创建一个从1开始递增的ID序列
    data.insert(0, 'ID', range(1, len(data) + 1))
    # 将所有Nan替换为None
    # data = data.replace({np.nan: None})
    # 写回CSV文件
    data.to_csv(f'{savePath}data_with_id.csv', index=False)