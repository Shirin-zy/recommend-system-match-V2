import React, { useState, useEffect } from "react";
import { Card, Typography, Row, Col } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import style from "./systemInfo.less";

const { Title, Text } = Typography;

const SystemInfo = () => {
  // 系统信息
  const [systemData, setSystemData] = useState([
    { cpuCore: 0, cpu_percent: 0.0 },
    { memory: 0.0, memory_percent: 0.0 },
    { total_space_gb: 0.0, disk_percent: 0.0 },
  ]);

  // 建立WebSocket连接监听系统信息
  const systemStatus = () => {
    const socket = new WebSocket("ws://127.0.0.1:5000/systemStatus"); // 注意路径中的连字符

    socket.onopen = () => {
      console.log("连接已建立");
    };

    socket.onmessage = (event) => {
      // 可以在这里解析JSON字符串并更新状态
      const sysInfo = JSON.parse(event.data);
      console.log("sysInfo:", sysInfo);
      setSystemData(sysInfo);
    };

    socket.onclose = (event) => {
      console.log(`连接已关闭，原因: ${event.code} ${event.reason}`);
    };

    socket.onerror = (error) => {
      console.error("WebSocket错误：", error);
    };

    // 返回一个清理函数，在组件卸载时关闭WebSocket连接
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
        console.log("WebSocket连接已被手动关闭");
      }
    };
  };

  useEffect(() => {
    systemStatus();
    return () => {
      // 这里不需要做额外的事情，因为systemStatus已经返回了清理函数
    };
  }, []);

  return (
    <>
      {" "}
      {/* 系统信息卡片 */}
      <Card
        style={{
          marginTop: "24px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
        }}
      >
        <Title level={4} style={{ marginBottom: "16px" }}>
          系统信息
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={6}>
            <div>
              <Text strong className={style.title}>
                系统版本：
              </Text>
              <Text className={style.details}>v2.5.3 (Build 20250328)</Text>
            </div>
            <div>
              <Text strong className={style.title}>
                许可证状态：
              </Text>
              <Text className={style.details}>
                企业版 - 有效期至 2026-03-28
              </Text>
            </div>
          </Col>
          <Col xs={24} md={6}>
            <div>
              <Text strong className={style.title}>
                CPU核心数：
              </Text>
              <Text className={style.details}>{systemData[0].cpuCore}核</Text>
            </div>
            <div>
              <Text strong className={style.title}>
                CPU使用率：
              </Text>
              <Text className={style.details}>{systemData[0].cpu_percent}%</Text>
            </div>
          </Col>
          <Col xs={24} md={6}>
            <div>
              <Text strong className={style.title}>
                内存：
              </Text>
              <Text className={style.details}>{systemData[1].memory}GB</Text>
            </div>
            <div>
              <Text strong className={style.title}>
                内存使用率：
              </Text>
              <Text className={style.details}>
                {systemData[1].memory_percent}%
              </Text>
            </div>
          </Col>
          <Col xs={24} md={6}>
            <div>
              <Text strong className={style.title}>
                磁盘：
              </Text>
              <Text className={style.details}>
                {systemData[2].total_space_gb}GB
              </Text>
            </div>
            <div>
              <Text strong className={style.title}>
                磁盘使用率：
              </Text>
              <Text className={style.details}>
                {systemData[2].disk_percent}%
              </Text>
            </div>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default SystemInfo;
