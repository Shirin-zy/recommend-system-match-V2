import pandas as pd
import os

#　读取data下的csv文件块合并并重新输出到data
def merge_csv_files(input_dir, output_file):
    # 获取目录下所有的CSV文件
    csv_files = [f for f in os.listdir(input_dir) if f.startswith('matchInfo') and f.endswith('.csv')]

    # 初始化一个空的DataFrame用于存储合并后的数据
    combined_df = pd.DataFrame()

    # 读取每个CSV文件并合并到combined_df
    for file in csv_files:
        file_path = os.path.join(input_dir, file)
        df = pd.read_csv(file_path)
        combined_df = pd.concat([combined_df, df], ignore_index=True)

    # 保存合并后的数据到新的CSV文件
    combined_df.to_csv(output_file, index=False, encoding='utf-8-sig')
    print(f"数据已成功合并并保存到 {output_file}")


if __name__ == "__main__":
    input_directory = '../data'
    output_file = '../data/data.csv'

    # 确保输出目录存在
    if not os.path.exists(input_directory):
        os.makedirs(input_directory)

    merge_csv_files(input_directory, output_file)