import pandas as pd
import numpy as np


def mergeWithData(data, oldData, savePath):
    # 如果oldData为空，则直接保存data
    if oldData.empty:
        data.to_csv(f'{savePath}data.csv', encoding='utf-8-sig', index=False)
        return

    # 使用外连接合并两个DataFrame，并标记来源
    merged = pd.merge(data, oldData, how='outer', indicator=True)

    # 筛选出仅出现在左侧（即新的数据）中的行
    new_rows = merged[merged['_merge'] == 'left_only'].drop(columns=['_merge'])

    # 将新行添加到oldData的前面
    updatedOldData = pd.concat([new_rows, oldData], ignore_index=True)

    # 保存最终结果到新文件
    updatedOldData.to_csv(f'{savePath}data.csv', encoding='utf-8-sig', index=False)