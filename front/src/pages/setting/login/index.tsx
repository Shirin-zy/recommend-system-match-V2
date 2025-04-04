// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import App from "@/stores/newApp";
import { Card, Form, Input, Button, Checkbox, message, Tabs } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  AntCloudOutlined,
} from "@ant-design/icons";
import style from "./index.less";
import { Register, Login } from "@/service/userAccount";
import { history } from "umi";

const LoginCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("login"); // 当前选项卡
  const [loginForm] = Form.useForm(); // 登录表单
  const [registerForm] = Form.useForm(); // 注册表单
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState<boolean>(false);

  // 切换登录/注册选项卡
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    loginForm.resetFields();
    registerForm.resetFields();
  };
  // 登录表单提交事件
  const onLoginFinish = async (values: any) => {
    const data = await Login(values.email, values.password);
    if (data.data.loginpass === true) {
      message.success(data.msg);
      App.setUserName(data.data.username);
      App.setToken(data.data.token);
      history.push("/");
    } else {
      message.error(data.msg);
    }
  };

  // 注册表单提交事件
  const onRegisterFinish = async (values: any) => {
    const data = await Register(values.email, values.password, values.username);
    if (data.data.result === true) {
      message.success(data.msg);
      setActiveTab("login");
    } else {
      message.error(data.msg);
    }
  };

  // 密码校验规则
  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error("请输入密码"));
    }
    if (value.length < 8) {
      return Promise.reject(new Error("密码长度不能少于8个字符"));
    }
    if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
      return Promise.reject(new Error("密码必须包含字母和数字"));
    }
    return Promise.resolve();
  };

  return (
    <div className={style.container}>
      <Card className={style.card} bodyStyle={{ padding: 0 }}>
        <div className={style.box}>
          {/* 左侧品牌区 */}
          <div className={style.left}>
            <span style={{ zIndex: 2 }}>
              <AntCloudOutlined
                style={{ fontSize: "60px", display: "inline-block" }}
              />{" "}
              <h1
                style={{
                  display: "inline-block",
                }}
              >
                高校竞赛系统
              </h1>
            </span>
            <span
              style={{ zIndex: 2, lineHeight: "60px", verticalAlign: "middle" }}
            >
              安全、高效、智能的竞赛推荐管理
            </span>
          </div>

          {/* 右侧表单区 */}
          <div className={style.right}>
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              centered
              items={[
                {
                  key: "login",
                  label: "登录",
                  children: (
                    <div style={{ padding: "20px 0" }}>
                      <Form
                        form={loginForm}
                        name="login"
                        layout="vertical"
                        onFinish={onLoginFinish}
                        autoComplete="off"
                        requiredMark={false}
                      >
                        <Form.Item
                          name="email"
                          label="邮箱"
                          rules={[{ required: true, message: "请输入邮箱" }]}
                        >
                          <Input
                            prefix={
                              <UserOutlined style={{ color: "#bfbfbf" }} />
                            }
                            size="large"
                            placeholder="请输入用户名或邮箱"
                            style={{ borderRadius: "8px" }}
                          />
                        </Form.Item>

                        <Form.Item
                          name="password"
                          label="密码"
                          rules={[{ required: true, message: "请输入密码" }]}
                        >
                          <Input.Password
                            prefix={
                              <LockOutlined style={{ color: "#bfbfbf" }} />
                            }
                            size="large"
                            placeholder="请输入密码"
                            iconRender={(visible) =>
                              visible ? (
                                <EyeTwoTone />
                              ) : (
                                <EyeInvisibleOutlined />
                              )
                            }
                            style={{ borderRadius: "8px" }}
                            visibilityToggle={{
                              visible: passwordVisible,
                              onVisibleChange: setPasswordVisible,
                            }}
                          />
                        </Form.Item>

                        <Form.Item>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Checkbox>记住我</Checkbox>
                            <a href="#" style={{ color: "#1890ff" }}>
                              忘记密码？
                            </a>
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
                            登录
                          </Button>
                        </Form.Item>

                        <div style={{ textAlign: "center", marginTop: "24px" }}>
                          <span style={{ color: "#8c8c8c" }}>还没有账号？</span>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setActiveTab("register");
                            }}
                            style={{ color: "#1890ff", marginLeft: "8px" }}
                          >
                            立即注册
                          </a>
                        </div>

                        <div style={{ marginTop: "40px", textAlign: "center" }}>
                          <div
                            style={{ color: "#8c8c8c", marginBottom: "16px" }}
                          >
                            其他登录方式
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              gap: "24px",
                            }}
                          >
                            <i
                              className="fab fa-weixin cursor-pointer"
                              style={{ fontSize: "24px", color: "#1890ff" }}
                            ></i>
                            <i
                              className="fab fa-qq cursor-pointer"
                              style={{ fontSize: "24px", color: "#1890ff" }}
                            ></i>
                            <i
                              className="fab fa-weibo cursor-pointer"
                              style={{ fontSize: "24px", color: "#1890ff" }}
                            ></i>
                          </div>
                        </div>
                      </Form>
                    </div>
                  ),
                },
                {
                  key: "register",
                  label: "注册",
                  children: (
                    <div style={{ padding: "20px 0" }}>
                      <Form
                        form={registerForm}
                        name="register"
                        layout="vertical"
                        onFinish={onRegisterFinish}
                        autoComplete="off"
                        requiredMark={false}
                      >
                        <Form.Item
                          name="username"
                          label="用户名"
                          rules={[
                            { required: true, message: "请输入用户名" },
                            { min: 4, message: "用户名不能少于4个字符" },
                            { max: 20, message: "用户名不能超过20个字符" },
                          ]}
                        >
                          <Input
                            prefix={
                              <UserOutlined style={{ color: "#bfbfbf" }} />
                            }
                            size="large"
                            placeholder="请输入用户名"
                            style={{ borderRadius: "8px" }}
                          />
                        </Form.Item>

                        <Form.Item
                          name="email"
                          label="邮箱"
                          rules={[
                            { required: true, message: "请输入邮箱" },
                            { type: "email", message: "请输入有效的邮箱地址" },
                          ]}
                        >
                          <Input
                            prefix={
                              <MailOutlined style={{ color: "#bfbfbf" }} />
                            }
                            size="large"
                            placeholder="请输入邮箱"
                            style={{ borderRadius: "8px" }}
                          />
                        </Form.Item>

                        <Form.Item
                          name="password"
                          label="密码"
                          rules={[{ validator: validatePassword }]}
                        >
                          <Input.Password
                            prefix={
                              <LockOutlined style={{ color: "#bfbfbf" }} />
                            }
                            size="large"
                            placeholder="请输入密码"
                            iconRender={(visible) =>
                              visible ? (
                                <EyeTwoTone />
                              ) : (
                                <EyeInvisibleOutlined />
                              )
                            }
                            style={{ borderRadius: "8px" }}
                            visibilityToggle={{
                              visible: passwordVisible,
                              onVisibleChange: setPasswordVisible,
                            }}
                          />
                        </Form.Item>

                        <Form.Item
                          name="confirmPassword"
                          label="确认密码"
                          dependencies={["password"]}
                          rules={[
                            { required: true, message: "请确认密码" },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (
                                  !value ||
                                  getFieldValue("password") === value
                                ) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error("两次输入的密码不一致")
                                );
                              },
                            }),
                          ]}
                        >
                          <Input.Password
                            prefix={
                              <LockOutlined style={{ color: "#bfbfbf" }} />
                            }
                            size="large"
                            placeholder="请确认密码"
                            iconRender={(visible) =>
                              visible ? (
                                <EyeTwoTone />
                              ) : (
                                <EyeInvisibleOutlined />
                              )
                            }
                            style={{ borderRadius: "8px" }}
                            visibilityToggle={{
                              visible: confirmPasswordVisible,
                              onVisibleChange: setConfirmPasswordVisible,
                            }}
                          />
                        </Form.Item>

                        <Form.Item>
                          <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                            className={style.button}
                          >
                            注册
                          </Button>
                        </Form.Item>

                        <div style={{ textAlign: "center", marginTop: "24px" }}>
                          <span style={{ color: "#8c8c8c" }}>已有账号？</span>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setActiveTab("login");
                            }}
                            style={{ color: "#1890ff", marginLeft: "8px" }}
                          >
                            立即登录
                          </a>
                        </div>
                      </Form>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default observer(LoginCard);
