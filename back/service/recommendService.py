from sqlalchemy import create_engine, text
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from collections import defaultdict
from collections import Counter

# 获取从数据库读取用户比赛数据
def readData():
    engine = create_engine('mysql+pymysql://root:zy15730850419@localhost/match_recommend_system')  # 替换为你的数据库连接字符串
    with engine.connect() as connection:
        query = text("SELECT email, collection FROM userInfo")

        result = connection.execute(query)
        rows = result.fetchall()

        # 初始化数据列表
        data = []

        # 遍历每一行数据
        for row in rows:
            email, collection_str = row

            # 将 collection 字符串拆分为整数列表
            if collection_str:
                collections = [int(item.strip()) for item in collection_str.split(",")]
            else:
                collections = []  # 如果 collection 为空，设置为空列表

            # 将处理后的数据添加到列表中
            data.append({
                "email": email,
                "collections": collections
            })

        # 将数据转换为 DataFrame
        df = pd.DataFrame(data)
        return df

# 构建用户-项目矩阵
def build_user_item_matrix(df):
    all_items = set(item for sublist in df['collections'] for item in sublist)
    user_item_matrix = {}
    for _, row in df.iterrows():
        email = row['email']
        collections = set(row['collections'])
        user_vector = {item: 1 if item in collections else 0 for item in all_items}
        user_item_matrix[email] = user_vector
    return pd.DataFrame(user_item_matrix).T

# 基于用户的协同过滤推荐算法
def recommend_items(user_id, user_item_matrix, top_n=5, k_neighbors=3):
    # Step 1: 计算目标用户与其他用户之间的相似度
    target_user_vector = user_item_matrix.loc[user_id].values.reshape(1, -1)
    similarities = {}
    for other_user in user_item_matrix.index:
        if other_user != user_id:
            other_user_vector = user_item_matrix.loc[other_user].values.reshape(1, -1)
            similarity = cosine_similarity(target_user_vector, other_user_vector)[0][0]
            similarities[other_user] = similarity

    # Step 2: 找到最相似的K个用户
    similar_users = sorted(similarities.items(), key=lambda x: x[1], reverse=True)[:k_neighbors]

    # Step 3: 收集相似用户收藏但目标用户未收藏的项目
    recommendations = defaultdict(float)
    target_user_items = set(user_item_matrix.columns[user_item_matrix.loc[user_id] == 1])
    for other_user, similarity_score in similar_users:
        other_user_items = set(user_item_matrix.columns[user_item_matrix.loc[other_user] == 1])
        for item in other_user_items - target_user_items:
            recommendations[item] += similarity_score

    # Step 4: 按权重排序，返回前N个推荐项目
    ids = []
    return sorted(recommendations.items(), key=lambda x: x[1], reverse=True)[:top_n]

# 获取推荐项目ID
def getRecoomendItemIds(email,top_n):
    df = readData()
    # 如果该用户为新用户无收藏记录则为其推荐热度最高的比赛内容
    if (email not in df['email'].values):
        all_collections = []
        for collection in df['collections']:
            if isinstance(collection, list):
                all_collections.extend(collection)
            else:
                raise ValueError('collections 列数据类型必须是列表')
        counter = Counter(all_collections)
        top_n = counter.most_common(top_n)
        ids = [item for item, count in top_n]
        return ids

    else:
        matrix = build_user_item_matrix(df)
        recommendIds = recommend_items(email,matrix,top_n=top_n)
        ids = []
        for i in range(0, len(recommendIds)):
            ids.append(recommendIds[i][0])
        return ids

#　获取推荐项目的详细内容
def getRecoomendItem(email,top_n= 5):
    engine = create_engine('mysql+pymysql://root:zy15730850419@localhost/match_recommend_system')  # 替换为你的数据库连接字符串
    data = {
        "code": 200,
        "msg": "",
        "data": {
            "list": [],
        }
    }
    #　推荐项目ID列表
    ids = getRecoomendItemIds(email,top_n)

    with engine.connect() as connection:
        query_select_detailInfo = text(f"SELECT * FROM matchInfo WHERE ID IN :ids")
        datas = connection.execute(query_select_detailInfo, {"ids": tuple(ids)}).fetchall()
        for row in datas:
            _, contest_id, contest_name, contest_url, is_exam, is_contest_status, \
            regist_start_time, regist_end_time, contest_start_time, contest_end_time, \
            thumb_pic, level_name, organiser, organiser_name, enter_range, \
            contest_class_first, contest_class_second, contest_class_second_id, \
            time_status, time_name, ranking, is_new, module = row

            # 构建每条记录的字典
            record = {
                'ID': _,
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
        data['msg'] = '获取成功'
        return data


if __name__ == '__main__':
    data = getRecoomendItem('1820207034@qq.com',5)
    print(data)