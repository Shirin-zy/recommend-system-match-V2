import jwt
import datetime

# 根据账号唯一ID生成token
def create_token(user_id:str):
    """
      根据用户ID创建JWT令牌。

      :param user_id: 用户的身份标识符
      :return: 生成的JWT令牌
      """
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=300000),  # 过期时间为1天后
        'iat': datetime.datetime.utcnow(),  # 发行时间为当前时间
        'sub': user_id  # 主题为用户ID
    }

    token = jwt.encode(payload,key='', algorithm='HS256')
    return token

# 验证token状态是否过期
def decode_token(token):
    """
    验证并解码JWT令牌。

    :param token: 要验证的JWT令牌
    :return: 解码后的载荷或错误信息
    """
    try:
        payload = jwt.decode(token, key='', algorithms=['HS256'])
        return payload['sub']  # 返回主题，即用户ID
    except jwt.ExpiredSignatureError:
        return 'expired'
    except jwt.InvalidTokenError:
        return 'token'
