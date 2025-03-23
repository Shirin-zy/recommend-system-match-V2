import pandas as pd
import numpy as np

# 读取CSV文件
df = pd.read_csv('data.csv')

# 创建一个从1开始递增的ID序列
df.insert(0, 'ID', range(1, len(df) + 1))

# 将所有Nan替换为None
df = df.replace({np.nan: None})

# 写回CSV文件
df.to_csv('data_with_id.csv', index=False)

print("已成功添加ID列，并保存到data_with_id.csv")