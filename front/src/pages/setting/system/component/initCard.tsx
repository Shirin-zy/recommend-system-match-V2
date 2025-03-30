import React, { useState, useEffect } from "react";
import style from "./initCard.less";
import InitSystem from "@/service/initSystem";

import { Card, Button, Typography, Modal } from "antd";
import {
  DatabaseOutlined,
  SettingOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

interface InitCardProps {
  systemStatus: "initialized" | "uninitialized"; // 系统状态
  setSystemStatus: (status: "initialized" | "uninitialized") => void;
  initModalVisible: boolean; // 初始化弹窗可见状态
  setInitModalVisible: (status: boolean) => void;
  initStatus: "loading" | "success"; // 初始化状态
  setInitStatus: (status: "loading" | "success") => void;
}
const InitCard = ({
  systemStatus,
  setSystemStatus,
  initModalVisible,
  setInitModalVisible,
  initStatus,
  setInitStatus,
}: InitCardProps) => {
  // 获取初始化状态
  const fetchInit = async () => {
    try {
      const data = await InitSystem();
      if (data.data[0].result === "succeed") {
        setInitStatus("success");
        setSystemStatus("initialized");
        localStorage.setItem("systemStatus", "initialized");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 开始初始化
  const startInit = () => {
    setInitModalVisible(true); // 初始化弹窗可见
    setInitStatus("loading");
    fetchInit();
  };

  return (
    <>
      {/* 初始化卡片 */}
      <Card className={style.card} bodyStyle={{ height: "100%" }}>
        <div className={style.flexColumn}>
          <div className={style.cardHeader}>
            <div className={style.iconContainer}>
              <DatabaseOutlined className={style.blueIcon} />
            </div>
            <Title level={4} style={{ marginLeft: 0 }}>
              系统初始化
            </Title>
          </div>

          <Paragraph className={style.cardContent}>
            在开始使用系统之前，需要进行系统初始化以确保数据结构和基础配置的正确设置。
            初始化过程将会创建必要的数据表、索引以及默认配置项。
          </Paragraph>

          <div className={style.cardFooter}>
            <Button
              type="primary"
              size="large"
              icon={<SettingOutlined />}
              onClick={startInit}
              disabled={systemStatus === "initialized"}
              className="!rounded-button whitespace-nowrap cursor-pointer"
              block
            >
              {systemStatus === "initialized" ? "系统已初始化" : "开始初始化"}
            </Button>
          </div>
        </div>
      </Card>
      {/* 初始化模态框 */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <DatabaseOutlined
              style={{ marginRight: "8px", color: "#1890ff" }}
            />
            系统初始化
          </div>
        }
        open={initModalVisible}
        footer={[
          <Button
            key="ok"
            type="primary"
            onClick={() => setInitModalVisible(false)}
            disabled={initStatus === "loading"}
            className="!rounded-button whitespace-nowrap cursor-pointer"
          >
            确认
          </Button>,
        ]}
        onCancel={() => initStatus === "success" && setInitModalVisible(false)}
        closable={initStatus === "success"}
        maskClosable={false}
        centered
        width={480}
      >
        <div className={style.modalContent}>
          {initStatus === "loading" ? (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <LoadingOutlined style={{ fontSize: 64, color: "#1890ff" }} />
              </div>
              <Title level={4} style={{ marginBottom: "8px" }}>
                系统初始化中
              </Title>
              <Paragraph style={{ color: "#999" }}>
                正在创建数据表和配置项，请稍候...
              </Paragraph>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <CheckCircleOutlined
                  style={{ fontSize: 64, color: "#52c41a" }}
                />
              </div>
              <Title level={4} style={{ marginBottom: "8px" }}>
                系统初始化完成！
              </Title>
              <Paragraph style={{ color: "#999" }}>
                所有数据表和配置项已成功创建，系统已准备就绪。
              </Paragraph>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default InitCard;
