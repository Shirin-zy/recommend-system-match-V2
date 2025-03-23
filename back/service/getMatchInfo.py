import requests

# 获取竞赛数据
def fetch_contest_lists(page: int, limit: int, univs_id: str = "", class_id: str = "", level: int = 0, sort: int = 0):
    base_url = "https://apiv4buffer.saikr.com/api/pc/contest/lists"
    params = {
        'page': page,
        'limit': limit,
        'univs_id': univs_id,
        'class_id': class_id,
        'level': level,
        'sort': sort
    }

    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()  # 如果响应状态码不是200，则抛出HTTPError
        return response.json().get('data', {}).get('list', [])  # 返回请求的数据列表
    except requests.exceptions.RequestException as e:
        print(f"获取比赛列表失败 (页码: {page}): {e}")
        return []  # 返回空列表以跳过该页