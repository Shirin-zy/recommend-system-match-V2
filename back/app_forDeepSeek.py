from openai import OpenAI

# Please install OpenAI SDK first: `pip3 install openai`

from openai import OpenAI

def chat():
    client = OpenAI(api_key="sk-2eb407036ec44a85b7d7c2913ad64290", base_url="https://api.deepseek.com")

    response = client.chat.completions.create(
        # model='deepseek-reasoner',
        model="deepseek-chat",

        messages=[
            {"role": "user", "content": "世界上最深的海沟是哪，在哪里"},
            {"role": "system", "content": "世界上最深的海沟是**马里亚纳海沟**（Mariana Trench），位于**西太平洋**，具体位置在**关岛和马里亚纳群岛以东**，靠近菲律宾海板块与太平洋板块的俯冲带。其最深处称为**挑战者深渊**（Challenger Deep），根据最新测量，深度约为**10,984米±25米**（2020年“奋斗者”号载人潜水器测得的数据），是地球已知的海洋最深处。\n\n### 关键信息：\n1. **深度**：约10,984米（相当于珠穆朗玛峰倒置再加2,000多米）。  \n2. **形成原因**：太平洋板块俯冲到菲律宾海板块下方，形成巨大的海沟。  \n3. **探索历史**：  \n   - 1960年，人类首次载人深潜至挑战者深渊（“的里雅斯特号”潜水器）。  \n   - 2012年，导演詹姆斯·卡梅隆独自下潜至该处。  \n   - 2020年，中国“奋斗者”号创下载人深潜纪录（10,909米）。  \n\n4. **极端环境**：高压（超1,000个大气压）、黑暗、低温，但仍有特殊生物（如深海狮子鱼）存活。  \n\n马里亚纳海沟是地球海洋探索的重要标志，也是研究极端生态系统和板块运动的关键区域。"},
            {"role": "user", "content": "展开介绍一下其它著名的海沟"},
        ],
        stream=False
    )
    print(response)
    print(response.choices[0].message.content)

if __name__ == '__main__':
    chat()