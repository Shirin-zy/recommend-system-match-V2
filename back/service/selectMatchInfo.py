from sqlalchemy import create_engine, text


def fetch_paginated_data(limit, page):
    """
    根据提供的limit和page参数从matchInfo表中分页获取数据。

    :param limit: 每页要获取的记录数
    :param page: 当前页码（从1开始）
    :param engine: SQLAlchemy引擎对象，用于连接数据库
    :return: 查询结果列表
    """

    engine = create_engine('mysql+pymysql://root:zy15730850419@localhost/match_recommend_system')  # 替换为你的数据库连接字符串
    offset = (page - 1) * limit

    data = {
        "code": 200,
        "msg": "",
        "data": {
            "list": []
        }
    }

    # SQL查询语句，使用LIMIT和OFFSET进行分页
    query = text("""
        SELECT * FROM matchInfo
        LIMIT :limit OFFSET :offset
    """)

    with engine.connect() as connection:
        result = connection.execute(query, {"limit": limit, "offset": offset})
        rows = result.fetchall()

    for row in rows:
        # 解包每一行的数据
        _, contest_id, contest_name, contest_url, is_exam, is_contest_status, \
        regist_start_time, regist_end_time, contest_start_time, contest_end_time, \
        thumb_pic, level_name, organiser, organiser_name, enter_range, \
        contest_class_first, contest_class_second, contest_class_second_id, \
        time_status, time_name, ranking, is_new, module = row

        # 构建每条记录的字典
        record = {
            "contest_id": contest_id,
            "contest_name": contest_name,
            "contest_url": contest_url,
            "is_exam": is_exam,
            "is_contest_status": is_contest_status,
            "regist_start_time": regist_start_time,
            "regist_end_time": regist_end_time,
            "contest_start_time": contest_start_time,
            "contest_end_time": contest_end_time,
            "thumb_pic": thumb_pic,
            "level_name": level_name,
            "organiser": organiser,
            "organiser_name": organiser_name,
            "enter_range": enter_range,
            "contest_class_first": contest_class_first,
            "contest_class_second": contest_class_second,
            "contest_class_second_id": contest_class_second_id,
            "time_status": time_status,
            "time_name": time_name,
            "rank": ranking,  # 注意这里原数据中的"ranking"字段名被改为"rank"
            "is_new": is_new,
            "module": module
        }

        # 将记录添加到列表中
        data["data"]["list"].append(record)

    return data


