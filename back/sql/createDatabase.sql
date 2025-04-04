CREATE DATABASE IF NOT EXISTS match_recommend_system;
USE match_recommend_system;

-- 插入单条模拟数据
INSERT INTO matchInfo (
    contest_id, contest_name, contest_url, is_exam, is_contest_status,
    regist_start_time, regist_end_time, contest_start_time, contest_end_time,
    thumb_pic, level_name, organiser, organiser_name, enter_range,
    contest_class_first, contest_class_second, contest_class_second_id,
    time_status, time_name, ranking, is_new, module
) VALUES (
    10001, '2025年全国编程大赛', 'url/to/contest10001', 0, 1,
    UNIX_TIMESTAMP('2025-03-01 00:00:00'), UNIX_TIMESTAMP('2025-04-01 23:59:59'),
    UNIX_TIMESTAMP('2025-05-01 09:00:00'), UNIX_TIMESTAMP('2025-05-02 18:00:00'),
    NULL, '国家级', '全国编程协会', '编程协会官方', '开放给所有高校',
    1001, 'programming', 1,
    1, '报名中', 0, 0, 0
) ON DUPLICATE KEY UPDATE
    contest_name=VALUES(contest_name),
    contest_url=VALUES(contest_url),
    is_exam=VALUES(is_exam),
    is_contest_status=VALUES(is_contest_status),
    regist_start_time=VALUES(regist_start_time),
    regist_end_time=VALUES(regist_end_time),
    contest_start_time=VALUES(contest_start_time),
    contest_end_time=VALUES(contest_end_time),
    thumb_pic=VALUES(thumb_pic),
    level_name=VALUES(level_name),
    organiser=VALUES(organiser),
    organiser_name=VALUES(organiser_name),
    enter_range=VALUES(enter_range),
    contest_class_first=VALUES(contest_class_first),
    contest_class_second=VALUES(contest_class_second),
    contest_class_second_id=VALUES(contest_class_second_id),
    time_status=VALUES(time_status),
    time_name=VALUES(time_name),
    ranking=VALUES(ranking),
    is_new=VALUES(is_new),
    module=VALUES(module);