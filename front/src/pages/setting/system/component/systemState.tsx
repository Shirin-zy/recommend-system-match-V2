import React, { useState } from "react";
import { Card, Typography, Row, Col, Statistic } from "antd";
import { CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
const { Title } = Typography;

interface SystemStateProps {
  lastSyncTime: string; // 上次同步时间
  systemStatus: "initialized" | "uninitialized"; // 系统状态
  currentDate: string; // 当前日期
}

const SystemState = ({
  lastSyncTime,
  systemStatus,
  currentDate,
}: SystemStateProps) => {
  return (
    <>
      <Card
        style={{
          marginBottom: "24px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
        }}
      >
        <Title level={4} style={{ marginBottom: "16px" }}>
          系统状态
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={8}>
            <Statistic
              title="系统状态"
              value={systemStatus === "initialized" ? "已初始化" : "未初始化"}
              valueStyle={{
                color: systemStatus === "initialized" ? "#52c41a" : "#faad14",
              }}
              prefix={
                systemStatus === "initialized" ? (
                  <CheckCircleOutlined />
                ) : (
                  <InfoCircleOutlined />
                )
              }
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="上次同步"
              value={lastSyncTime}
              valueStyle={{ fontSize: "14px" }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="当前日期"
              value={currentDate}
              valueStyle={{ fontSize: "14px" }}
            />
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default SystemState;
