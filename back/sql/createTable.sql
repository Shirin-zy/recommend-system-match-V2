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