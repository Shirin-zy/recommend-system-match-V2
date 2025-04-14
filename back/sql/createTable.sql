-- 比赛信息表
CREATE TABLE IF NOT EXISTS matchInfo (
    ID INT PRIMARY KEY, -- ID 主键
    contest_id BIGINT , -- id
    contest_name VARCHAR(255), -- 比赛名称
    contest_url VARCHAR(255), -- 比赛网址
    is_exam TINYINT, -- 是否考试
    is_contest_status TINYINT, -- 比赛状态
    regist_start_time INT, -- 报名开始时间
    regist_end_time INT, -- 报名结束时间
    contest_start_time INT, -- 比赛开始时间
    contest_end_time INT, -- 比赛结束时间
    thumb_pic TEXT, -- 缩略图链接
    level_name VARCHAR(100), -- 级别名称
    organiser TEXT, -- 组织者
    organiser_name VARCHAR(255), -- 组织者名称
    enter_range VARCHAR(1000), -- 参与范围
    contest_class_first INT, -- 比赛类别第一级
    contest_class_second VARCHAR(50), -- 比赛类别第二级
    contest_class_second_id INT, -- 比赛类别第二级ID
    time_status INT, -- 时间状态
    time_name VARCHAR(100), -- 时间名称
    ranking INT, -- 排名
    is_new TINYINT, -- 是否新赛事
    module INT -- 模块
);

-- 用户账号表
CREATE TABLE  IF NOT  EXISTS userCount (
    email VARCHAR(255) PRIMARY KEY, -- 邮箱
    password VARCHAR(20), -- 密码
    username VARCHAR(20), -- 用户名
    role VARCHAR(20) -- 角色
);

-- 用户信息表
CREATE TABLE IF NOT EXISTS userInfo (
    email VARCHAR(255) PRIMARY KEY , -- 邮箱
    professional VARCHAR(100), -- 专业
    purpose INT, -- 参赛目的
    experience INT, -- 参赛经验
    interest INT, -- 兴趣爱好
    level VARCHAR(20), -- 年级
    nature INT, -- 性格
    starttime INT, -- 期望开始参赛时间
    endtime INT, -- 期望比赛结束时间
    collection VARCHAR(10000) -- 收藏的比赛
);

