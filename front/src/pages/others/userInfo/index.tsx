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
import style from "./index.less";
import { nature, categories, experience, purpose } from "./data";
import { useEffect } from "react";
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
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo(App.state.email); // 等待获取数据
        const userInfo = data.data.userInfo;
        userInfoForm.setFieldsValue(userInfo);
        console.log("用户信息:", userInfo);
      } catch (error) {
        console.error("获取比赛数据时出错:", error);
      } finally {
        // 无论成功与否，加载状态都要结束
      }
    };
    fetchUserInfo();
  }, []);
  // 提交用户信息表单
  const submitInfo = async (values: any) => {
    const data = await updateUserInfo(
      App.state.email,
      values.professional,
      values.purpose,
      values.experience,
      values.interest,
      values.level,
      values.nature,
      convertToTimestamp(values.timeRange[0]),
      convertToTimestamp(values.timeRange[1])
    );
    if (data.data.data.result === "succeed") {
      message.success(data.data.msg);
      history.push("/");
      localStorage.setItem("tipsVisible", JSON.stringify(false));
    } else {
      message.error(data.data.msg);
    }
  };

  return (
    <>
      <div className={style.container}>
        <Card className={style.card}>
          <LeftCircleOutlined
            style={{
              fontSize: "20px",
              color: "#333",
              position: "absolute",
              left: "20px",
              top: "20px",
            }}
            onClick={() => {
              window.history.back();
            }}
          />
          <h2>完善资料</h2>
          <Divider></Divider>
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
            <Form.Item name="interest">
              <Select
                prefix="兴趣爱好："
                placeholder="请选择兴趣爱好"
                size="large"
                style={{ borderRadius: "8px" }}
              >
                {categories.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="nature">
              <Select
                prefix="性格偏好："
                placeholder="请选择性格偏好"
                size="large"
                style={{ borderRadius: "8px" }}
              >
                {nature.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="experience">
              <Select
                prefix="参赛经历："
                placeholder="是否有参赛经历"
                size="large"
                style={{ borderRadius: "8px" }}
              >
                {experience.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="purpose">
              <Select
                prefix="参赛目的："
                placeholder="请选择参赛目的"
                size="large"
                style={{ borderRadius: "8px" }}
              >
                {purpose.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
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
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                className={style.button}
              >
                保存
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default observer(UserInfo);
