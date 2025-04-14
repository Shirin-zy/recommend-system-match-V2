import {
  Card,
  Divider,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  message,
} from "antd";
import { LeftCircleOutlined } from "@ant-design/icons";
import style from "./test.less";
import { useEffect, useState } from "react";
import { getUserInfo, updateUserInfo } from "@/service/userInfo";
import { observer } from "mobx-react-lite";
import App from "@/stores/newApp";
import dataSync from "@/pages/data/dataSync";
import { history } from "umi";

const { Option } = Select;

// 将日期字符串转换为时间戳
const convertToTimestamp = (dateStr: string): number => {
  // 转换为ISO格式，确保能被正确解析
  const isoStr = dateStr.replace(" ", "T") + ":00Z";
  const date = new Date(isoStr);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  const timestamp = Math.floor(date.getTime() / 1000);
  return timestamp;
};

const UserInfo = () => {
  const [userInfoForm] = Form.useForm(); // 用户信息表单
  const [level, setLevel] = useState("");
  // 子页面中发送消息给父页面
  const sendMessageToParent = () => {
    // 关键：通过 parent 或 top 访问父页面的 window 对象
    window.parent.postMessage(
      {
        type: "message",
        data: { msg: "这是子页面发送的消息" },
      },
      "*" // 父页面的 Origin（必须精确匹配）
    );
  };
  useEffect(() => {
    // 定义事件处理器
    const handleMessage = (event) => {
      // 确保消息来源于可信的源
      if (event.origin !== "http://localhost:8000") return; // 替换为实际的可信源

      console.log("子页面获取到消息:", event.data); // 打印接收到的数据
      userInfoForm.setFieldsValue({
        level: event.data.data.msg,
      });
      // 这里可以根据您的需求对接收到的数据进行处理
    };

    // 添加事件监听器
    window.addEventListener("message", handleMessage);

    // 清理函数，在组件卸载时移除事件监听器
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  //   useEffect(() => {
  //     const fetchUserInfo = async () => {
  //       try {
  //         const data = await getUserInfo(App.state.email); // 等待获取数据
  //         const userInfo = data.data.userInfo;
  //         userInfoForm.setFieldsValue(userInfo);
  //         console.log("用户信息:", userInfo);
  //       } catch (error) {
  //         console.error("获取比赛数据时出错:", error);
  //       } finally {
  //         // 无论成功与否，加载状态都要结束
  //       }
  //     };
  //     fetchUserInfo();
  //   }, []);
  // 提交用户信息表单
  const submitInfo = async (values: any) => {
    console.log("提交表单:", values);
    // const data = await updateUserInfo(
    //   App.state.email,
    //   values.professional,
    //   values.purpose,
    //   values.experience,
    //   values.interest,
    //   values.level,
    //   values.nature,
    //   convertToTimestamp(values.timeRange[0]),
    //   convertToTimestamp(values.timeRange[1])
    // );
    // if (data.data.data.result === "succeed") {
    //   message.success(data.data.msg);
    //   history.push("/");
    //   localStorage.setItem("tipsVisible", JSON.stringify(false));
    // } else {
    //   message.error(data.data.msg);
    // }
  };

  return (
    <>
      <div className={style.container}>
        <Card className={style.card}>
          <Form
            form={userInfoForm}
            layout="vertical"
            onFinish={submitInfo}
            autoComplete="off"
            requiredMark={false}
          >
            <Form.Item name="level">
              <Input
                prefix="年级："
                size="large"
                placeholder="请输入年级(大一/研一)"
                style={{ borderRadius: "8px" }}
              />
            </Form.Item>
            <Form.Item name="professional">
              <Input
                prefix="专业："
                size="large"
                placeholder="请输入专业"
                style={{ borderRadius: "8px" }}
              />
            </Form.Item>
            <Form.Item
              name="timeRange"
              label="参赛时间段"
              style={{ marginBottom: "20px" }} // 消除默认底部间距
            >
              <div style={{ display: "flex", gap: 12 }}>
                <DatePicker
                  placeholder="开始时间"
                  size="large"
                  style={{
                    flex: 1,
                    borderRadius: "8px",
                  }}
                  showTime={{ format: "HH:mm" }} // 如果需要选择具体时间
                  format="YYYY-MM-DD HH:mm" // 根据需求调整格式
                  onChange={(date, dateString) => {
                    userInfoForm.setFieldsValue({
                      timeRange: [
                        dateString,
                        userInfoForm.getFieldValue("timeRange")?.[1],
                      ],
                    });
                  }} // 更新开始时间
                />
                <DatePicker
                  placeholder="结束时间"
                  size="large"
                  style={{
                    flex: 1,
                    borderRadius: "8px",
                  }}
                  showTime={{ format: "HH:mm" }}
                  format="YYYY-MM-DD HH:mm"
                  onChange={(date, dateString) => {
                    userInfoForm.setFieldsValue({
                      timeRange: [
                        userInfoForm.getFieldValue("timeRange")?.[0],
                        dateString,
                      ],
                    });
                  }} // 更新结束时间
                />
              </div>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className={style.button}
              onClick={sendMessageToParent}
            >
              保存
            </Button>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default observer(UserInfo);
