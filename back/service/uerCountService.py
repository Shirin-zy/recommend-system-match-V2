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
        query = text("SELECT username, password, role, email FROM usercount WHERE email = :email")
        result = connection.execute(query,{'email':email.strip()}).fetchone()

        if result is not None and result.password == passWord:
            data['data']['loginpass'] = True
            data['data']['role'] = result.role
            data['data']['username'] = result.username
            data['data']['token'] = create_token(result.email)
            data['msg'] = '登录成功'
        else:
            data['msg'] = '邮箱或密码错误'
    return data


#　注册
def handle_register(userName,passWord,email):
    engine = create_engine('mysql+pymysql://root:zy15730850419@localhost/match_recommend_system')  # 替换为你的数据库连接字符串

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
                "INSERT INTO usercount (username, password, email, role) VALUES (:userName, :passWord, :email, :role)")
            connection.execute(query_insert,
                               {"userName": userName.strip(), "passWord": passWord, "email": email.strip(),
                                "role": "common"})
            connection.commit()
            data['data']['result'] = True
            data['msg'] = '注册成功'
    return  data








