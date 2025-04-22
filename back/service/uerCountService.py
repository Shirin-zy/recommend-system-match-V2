import time

from sqlalchemy import create_engine, text
from back.service.tokenServiceByJWT import create_token,decode_token

# 登录
def handle_login(email,passWord):
    engine = create_engine('mysql+pymysql://root:zy15730850419@localhost/match_recommend_system')  # 替换为你的数据库连接字符串

    data = {
        "code": 200,
        "msg": "",
        "data": {
            "username": '',
            'loginpass': False,
            'role': '',
            'token':''
        }
    }

    with engine.connect() as connection:
        query = text("SELECT username, password, role, email, status FROM usercount WHERE email = :email")
        result = connection.execute(query,{'email':email.strip()}).fetchone()
        if result is not None and result.status == 'lock':
            data['msg'] = '该账号以被冻结'
        elif result is not None and result.password == passWord and result.status == 'active':
            data['data']['loginpass'] = True
            data['data']['role'] = result.role
            data['data']['username'] = result.username
            data['data']['token'] = create_token(result.email)
            data['msg'] = '登录成功'
        else:
            data['msg'] = '邮箱或密码错误'
    return data


#　注册
def handle_register(userName,passWord,email,role):
    engine = create_engine('mysql+pymysql://root:zy15730850419@localhost/match_recommend_system')  # 替换为你的数据库连接字符串
    createDate =  round(time.time())

    data = {
        "code": 200,
        "msg": "",
        "data": {
            'result': False
        }
    }

    with engine.connect() as connection:
        query_select = text("SELECT username, password, role FROM usercount WHERE email = :email")
        result = connection.execute(query_select,{'email':email.strip()}).fetchone()

        if result is not None:
            data['data']['result'] = False
            data['msg'] = '该邮箱已被注册'
        else:
            # 插入新用户数据
            query_insert = text(
                "INSERT INTO usercount (username, password, email, role, status, createDate) VALUES (:userName, :passWord, :email, :role, :status, :createDate)")
            connection.execute(query_insert,
                               {"userName": userName.strip(), "passWord": passWord, "email": email.strip(),
                                "role": role, 'status':'active', 'createDate':createDate})
            connection.commit()
            data['data']['result'] = True
            data['msg'] = '注册成功'
    return  data

# 注销账户
def deleteAccount(email):
    engine = create_engine('mysql+pymysql://root:zy15730850419@localhost/match_recommend_system')  # 替换为你的数据库连接字符串

    data = {
        "code": 200,
        "msg": "",
        "data": {
            'result': False
        }
    }

    with engine.connect() as connection:
        # 删除userInfo表
        delete_userInfo = text("DELETE FROM userInfo WHERE email=:email")
        delete_userInfo_result = connection.execute(delete_userInfo,{"email":email})

        # 删除useCount表
        delete_userCount = text("DELETE FROM userCount WHERE email=:email")
        delete_userCount_result =  connection.execute(delete_userCount,{"email":email})

        connection.commit()

        if delete_userCount_result.rowcount >0 or delete_userInfo_result.rowcount >0:
            data['data']['result'] = True
            data['msg'] = '账户删除成功'
        else:
            data['msg'] = '删除失败'

    return data

#更新账户信息
def updateUserAccount(userName,email,role,status,password):
    engine = create_engine('mysql+pymysql://root:zy15730850419@localhost/match_recommend_system')  # 替换为你的数据库连接字符串

    data = {
        "code": 200,
        "msg": "",
        "data": {
            'result': False
        }
    }

    account_data = {
        "email": email,
        "role":role,
        "username":userName,
        "status":status,
        'password':password
    }

    with engine.connect() as connection:
        # 查询是否存在相同的email
        query_select = text("SELECT COUNT(*) FROM usercount WHERE email = :email")
        result = connection.execute(query_select, {"email": email}).fetchone()

        # 如果存在，执行更新操作
        query_update = text("""
                           UPDATE usercount 
                           SET username=:username,role=:role ,status=:status,password=:password
                           WHERE email=:email
                       """)
        try:
            connection.execute(query_update, account_data)
            connection.commit()
            data['data']['result'] = 'succeed'
            data['msg'] = '更新成功'
        except Exception as e:
            data['msg'] = '更新失败'
            print(f"An error occurred during update: {e}")
            connection.rollback()

    return data

# 获取全部账户
def getAllAccount(page,limit):
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
    # 分页获取数据
    query_paginate = text(f"""
                SELECT * FROM userCount
                LIMIT :limit OFFSET :offset
            """)

    # 获取数据总数
    query_count = text(f"""
                SELECT COUNT(*) AS total FROM userCount
            """)

    with engine.connect() as connection:
        # 执行分页查询
        result_paginate = connection.execute(query_paginate, {"limit": limit, "offset": offset})
        rows = result_paginate.fetchall()

        # 执行计数查询
        result_count = connection.execute(query_count)
        total_records = result_count.fetchone()[0]

        for row in rows:
            _,password,username,role,status,createDate = row

            #　构架每条记录的字典
            record = {
                'email': _,
                'username':username,
                'role':role,
                'status':status,
                'createDate':createDate,
                'password':password
            }

            data["data"]["list"].append(record)
            data['data']['total'] = total_records

    return data

# 按关键词搜索账户
def searchAccount(key):
    engine = create_engine('mysql+pymysql://root:zy15730850419@localhost/match_recommend_system')  # 替换为你的数据库连接字符串
    data = {
        "code": 200,
        "msg": "",
        "data": {
            "list": [],
            "total": 0  # 新增：用于存储总记录数
        }
    }

    # 判断是否为邮箱（以.com结尾）
    if key.endswith('.com'):
        query = text(f"""
                        SELECT * FROM userCount WHERE email=:email 
                    """)
        with engine.connect() as connection:
            rows = connection.execute(query, {"email": key}).fetchall()
            for row in rows:
                _, password, username, role, status, createDate = row

                # 　构架每条记录的字典
                record = {
                    'email': _,
                    'username': username,
                    'role': role,
                    'status': status,
                    'createDate': createDate,
                    'password': password
                }

                data["data"]["list"].append(record)
                data['data']['total'] = len(rows)

        return data

    # 角色映射字典
    role_mapping = {
        '普通用户': 'common',
        '管理员': 'admin',
        '超级管理员': 'root'
    }
    # 判断是否为预设角色
    if key in role_mapping:
        print(role_mapping[key])
        query = text(f"""
                        SELECT * FROM userCount WHERE role =:role 
                           """)
        with engine.connect() as connection:
            rows = connection.execute(query, {"role": role_mapping[key]}).fetchall()
            for row in rows:
                _, password, username, role, status, createDate = row

                # 　构架每条记录的字典
                record = {
                    'email': _,
                    'username': username,
                    'role': role,
                    'status': status,
                    'createDate': createDate,
                    'password': password
                }

                data["data"]["list"].append(record)
                data['data']['total'] = len(rows)

        return  data

    if(len(key)==0):
        data = getAllAccount(1,10)
        return  data

    else:
        query = text(f"""
                            SELECT * FROM userCount WHERE username =:username 
                                  """)
        with engine.connect() as connection:
            rows = connection.execute(query, {"username": key}).fetchall()
            for row in rows:
                _, password, username, role, status, createDate = row

                # 　构架每条记录的字典
                record = {
                    'email': _,
                    'username': username,
                    'role': role,
                    'status': status,
                    'createDate': createDate,
                    'password': password
                }

                data["data"]["list"].append(record)
                data['data']['total'] = len(rows)
        # 默认返回原值
        return data


if __name__ == '__main__':
    data = searchAccount("超级管理员")
    print(data)








