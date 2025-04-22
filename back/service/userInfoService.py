from sqlalchemy import create_engine, text
from back.service.tokenServiceByJWT import create_token

# 编辑用户信息
def handle_editUserInfo(email,professional,purpose,experience,interest,level,nature,starttime,endtime):
    engine = create_engine('mysql+pymysql://root:zy15730850419@localhost/match_recommend_system')  # 替换为你的数据库连接字符串

    data = {
        "code": 200,
        "msg": "",
        "data": {
           'result':'fail'
        }
    }
    user_data = {
        "email": email,
        "professional": professional,  # 需要从其他地方获取或定义
        "purpose": purpose,  # 需要从其他地方获取或定义
        "experience": experience,  # 需要从其他地方获取或定义
        "interest": interest,  # 需要从其他地方获取或定义
        "level": level,  # 需要从其他地方获取或定义
        "nature": nature,  # 需要从其他地方获取或定义
        "starttime": starttime,  # 需要从其他地方获取或定义
        "endtime": endtime  # 需要从其他地方获取或定义
    }

    with engine.connect() as connection:
        # 查询是否存在相同的email
        query_select = text("SELECT COUNT(*) FROM userInfo WHERE email = :email")
        result = connection.execute(query_select, {"email": email}).fetchone()

        if result[0] > 0:
            # 如果存在，执行更新操作
            query_update = text("""
                   UPDATE userInfo 
                   SET professional=:professional, purpose=:purpose, experience=:experience,
                       interest=:interest, level=:level, nature=:nature, starttime=:starttime, endtime=:endtime
                   WHERE email=:email
               """)
            try:
                connection.execute(query_update, user_data)
                connection.commit()
                data['data']['result'] = 'succeed'
                data['msg'] = '更新成功'
            except Exception as e:
                data['msg'] = '更新失败'
                print(f"An error occurred during update: {e}")
                connection.rollback()
        else:
            # 如果不存在，执行插入操作
            query_insert = text("""
                   INSERT INTO userInfo (email, professional, purpose, experience, interest, level, nature, starttime, endtime) 
                   VALUES (:email, :professional, :purpose, :experience, :interest, :level, :nature, :starttime, :endtime)
               """)
            try:
                connection.execute(query_insert, user_data)
                connection.commit()
                data['data']['result'] = 'succeed'
                data['msg'] = '更新成功'
            except Exception as e:
                data['msg'] = '更新失败'
                print(f"An error occurred during insert: {e}")
                connection.rollback()

    return data


#　获取用户信息
def handle_getUserInfo(email):
    engine = create_engine('mysql+pymysql://root:zy15730850419@localhost/match_recommend_system')  # 替换为你的数据库连接字符串

    data = {
        "code": 200,
        "msg": "",
        "data": {
            'userInfo':{
                'professional' : '',
                'purpose' : None,
                'experience' : None,
                'interest' : None,
                'level' : '',
                'nature' : None
            }
        }
    }

    with engine.connect() as connection:
        query_select = text("SELECT * FROM userInfo WHERE email = :email")
        result = connection.execute(query_select,{'email':email.strip()}).fetchone()
        if result is not None:
            data['data']['userInfo']['professional'] = result.professional
            data['data']['userInfo']['purpose'] = result.purpose
            data['data']['userInfo']['experience'] = result.experience
            data['data']['userInfo']['interest'] = result.interest
            data['data']['userInfo']['level'] = result.level
            data['data']['userInfo']['nature'] = result.nature

            data['msg'] = '获取信息成功'
        else:
            return data

    return  data

# 收藏的比赛
def collectedMatch(id,email):
    engine = create_engine('mysql+pymysql://root:zy15730850419@localhost/match_recommend_system')  # 替换为你的数据库连接字符串

    data = {
        "code": 200,
        "msg": "",
        "data": {
            'collections':''
            }
        }

    with engine.connect() as connection:
        # 首先查询是否存在指定email的记录
        query_select = text("SELECT * FROM userInfo WHERE email = :email")
        result = connection.execute(query_select, {"email": email}).fetchone()
        # 判断数据库中是否存在该行
        if result is not None:
            collections_str = result[-1]  # 获取collection字段值
            collections_list = collections_str.split(',') if collections_str else []  # 转化为列表

            id_str = str(id)  # 确保比较时类型一致
            if id_str in collections_list:
                collections_list.remove(id_str)  # 如果存在则删除
                data['msg'] = '取消收藏'
            else:
                collections_list.append(id_str)  # 如果不存在则添加
                data['msg'] = '收藏成功'

            updated_collections_str = ','.join(collections_list)  # 列表转回字符串

            # 更新数据库中的记录
            query_update = text("UPDATE userInfo SET collection = :collection WHERE email = :email")
            connection.execute(query_update, {"collection": updated_collections_str, "email": email})
            connection.commit()

            data["data"]['collections'] = updated_collections_str
        else:
            # 插入新记录
            initial_collection = str(id)  # 新记录的collection字段值
            query_insert = text("INSERT INTO userInfo (email, collection) VALUES (:email, :collection)")
            connection.execute(query_insert, {"email": email, "collection": initial_collection})
            connection.commit()
            data["data"] = {'email': email, 'collections': initial_collection}
            data['msg'] = "收藏成功"

    return  data

if __name__ == '__main__':
    data = collectedMatch(email='15024244414@qq.com',id='10086')
    print(data)