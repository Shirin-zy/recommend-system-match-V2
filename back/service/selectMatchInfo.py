from sqlalchemy import create_engine, text


def fetch_paginated_data(limit, page):
    engine = create_engine('mysql+pymysql://root:zy15730850419@localhost/match_recommend_system')  # 替换为你的数据库连接字符串
    offset = (page - 1) * limit

    data = {
        "code": 200,
        "msg": "",
        "data": {
            "list": [],
            "total": 0  # 新增：用于存储总记录数
        }
    }

    # SQL查询语句，使用LIMIT和OFFSET进行分页
    query_paginate = text("""
        SELECT * FROM matchInfo
        LIMIT :limit OFFSET :offset
    """)

    # 获取总记录数的SQL查询
    query_count = text("""
        SELECT COUNT(*) AS total FROM matchInfo
    """)

    with engine.connect() as connection:
        # 执行分页查询
        result_paginate = connection.execute(query_paginate, {"limit": limit, "offset": offset})
        rows = result_paginate.fetchall()

        # 执行计数查询
        result_count = connection.execute(query_count)
        total_records = result_count.fetchone()[0]

    for row in rows:
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

        data["data"]["list"].append(record)

    # 将总记录数添加到返回的数据结构中
    data["data"]["total"] = total_records

    return data