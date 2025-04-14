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



def get_info():
    base_url = 'https://we.51job.com/api/job/search-pc?api_key=51job&timestamp=1744362594&keyword=&searchType=2&function=&industry=&jobArea=090200&jobArea2=&landmark=&metro=&salary=&workYear=&degree=&companyType=&companySize=&jobType=&issueDate=&sortType=0&pageNum=8&requestId=64f266783e9c114e714492ed0bcd25f1&pageSize=20&source=1&accountId=&pageCode=sou%7Csou%7Csoulb&scene=7&u_atoken=b57c99afa8add1ad05123c65d43d288b&u_asession=01hIHN2C7DO4CHNi135itIW-rQvq89utNQx05s6zC4ke0_ZCGgolYL9t-4H79WZJnKJB-YY_UqRErInTL5mMzm-GyPlBJUEqctiaTooWaXr7I&u_asig=05NPKsa1LYA5dxZ15f5YICSj0D1gxa9z2VFdHdMnpTaneIQaK7FBk3iKJVYC4UEiaI_B2dzk1MRuHtGZ6tNWApeZm8QkiPGylA_1rl6j9s_EnmR65BnQRUWIrnQVskqEbU7l4rynLhlyJGbvBdWucoQiltLzNjSrE5igmHcisEanHBzhvSc0Kr8URjOX9Xe4tka6AzhQ9pR0V3yWA3ipkTxVHY9neLckJ027Qt5XumT5yCEbaGu1FosmeHMi2IN_MD-HYS3Adl4u1pWnHt8-o2_wUScSXiSCwv-O0iZH3QMkEMI7Z-80-lKwjxRoAdqb7gF-n1f-CA6GZoq9ddPTuuQA&u_aref=tXJFdsVSWlNq4%2BDUiwQJHRMR9ks%3D'
    try:
        response = requests.get(base_url,verify=False)
        response.raise_for_status()  # 如果响应状态码不是200，则抛出HTTPError
        return response.json().get('data', {}).get('list', [])  # 返回请求的数据列表
    except requests.exceptions.RequestException as e:
        print(f"获取比赛列表失败 : {e}")
        return []  # 返回空列表以跳过该页
if __name__ == '__main__':
    data = get_info()
    print(data)