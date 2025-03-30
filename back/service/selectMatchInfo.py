from sqlalchemy import create_engine, text

def fetch_paginated_data(limit, page, class_id, level, sort):
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

    # 动态构建WHERE子句
    where_clauses = []
    if len(class_id.strip()) > 0:
        ids = class_id.split('|')
        conditions = [f"contest_class_second_id = {id}" for id in ids]
        where_clauses.append(" OR ".join(conditions))

    # 根据level参数构建额外的WHERE条件
    level_mapping = {
        0: "",  # 不限
        1: "校级",
        2: "市级",
        3: "省级",
        4: "全国性",
        5: "全球性",
        6: "自由",
        7: "其它"
    }
    if level in level_mapping and level != 0:  # 如果level不是"不限"
        where_clauses.append(f"level_name = '{level_mapping[level]}'")

    where_clause = "WHERE " + " AND ".join(where_clauses) if where_clauses else ""

    # 根据sort参数构建ORDER BY子句
    order_by_clause = ""
    if sort == 0:
        order_by_clause = "ORDER BY regist_start_time DESC"
    elif sort == 1:
        order_by_clause = "ORDER BY contest_start_time DESC"
    elif sort ==2:
        order_by_clause = 'ORDER BY ID ASC'

    # SQL查询语句，使用LIMIT和OFFSET进行分页，并添加WHERE条件和ORDER BY条件
    query_paginate = text(f"""
            SELECT * FROM matchInfo
            {where_clause}
            {order_by_clause}
            LIMIT :limit OFFSET :offset
        """)

    # 获取总记录数的SQL查询，并添加WHERE条件（注意这里不需要ORDER BY）
    query_count = text(f"""
            SELECT COUNT(*) AS total FROM matchInfo
            {where_clause}
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