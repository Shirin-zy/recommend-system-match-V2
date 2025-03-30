# 将数据插入到数据库
import pandas as pd
import numpy as np
from sqlalchemy import create_engine, text


def handle_nan(series):
    """将Series中的nan值替换为None"""
    for col in series.index:
        if pd.isna(series[col]):
            series[col] = None
    return series


def store_data_to_mysql(df):
    # 创建数据库连接
    engine = create_engine('mysql+pymysql://root:zy15730850419@localhost/match_recommend_system')

    with engine.connect() as connection:
        for index, row in df.iterrows():
            # 处理nan值
            params = handle_nan(row).to_dict()
            if index % 100 == 0:
                print(params)

            query = text("""
            INSERT INTO matchInfo (ID, contest_id, contest_name, contest_url, is_exam, is_contest_status,
                                   regist_start_time, regist_end_time, contest_start_time, contest_end_time,
                                   thumb_pic, level_name, organiser, organiser_name, enter_range,
                                   contest_class_first, contest_class_second, contest_class_second_id,
                                   time_status, time_name, ranking, is_new, module)
            VALUES (:ID, :contest_id, :contest_name, :contest_url, :is_exam, :is_contest_status,
                    :regist_start_time, :regist_end_time, :contest_start_time, :contest_end_time,
                    :thumb_pic, :level_name, :organiser, :organiser_name, :enter_range,
                    :contest_class_first, :contest_class_second, :contest_class_second_id,
                    :time_status, :time_name, :ranking, :is_new, :module)
            ON DUPLICATE KEY UPDATE 
                contest_name=VALUES(contest_name),
                contest_url=VALUES(contest_url),
                is_exam=VALUES(is_exam),
                is_contest_status=VALUES(is_contest_status),
                regist_start_time=VALUES(regist_start_time),
                regist_end_time=VALUES(regist_end_time),
                contest_start_time=VALUES(contest_start_time),
                contest_end_time=VALUES(contest_end_time),
                thumb_pic=VALUES(thumb_pic),
                level_name=VALUES(level_name),
                organiser=VALUES(organiser),
                organiser_name=VALUES(organiser_name),
                enter_range=VALUES(enter_range),
                contest_class_first=VALUES(contest_class_first),
                contest_class_second=VALUES(contest_class_second),
                contest_class_second_id=VALUES(contest_class_second_id),
                time_status=VALUES(time_status),
                time_name=VALUES(time_name),
                ranking=VALUES(ranking),
                is_new=VALUES(is_new),
                module=VALUES(module);
            """)
            connection.execute(query, params)
            connection.commit()  # 显式提交


def merge_csv_files():
    # 读取csv文件到DataFrame
    df = pd.read_csv('../data/data_with_id.csv', encoding='utf-8-sig')

    return df


if __name__ == "__main__":
    df = merge_csv_files()
    store_data_to_mysql(df)