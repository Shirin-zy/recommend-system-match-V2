// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect } from "react";
import SystemState from "./component/systemState";
import SyncHistory from "./component/syncHistory";
import InitCard from "./component/initCard";
import SyncCard from "./component/syncCard";
import SystemInfo from "./component/systemInfo";
import { Typography, Row, Col, Divider } from "antd";
import { CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import styles from "./index.less";

const { Title, Text } = Typography;
// const styles = {
//   container: {
//     minHeight: "85vh",
//     backgroundColor: "#f5f5f5",
//   },
//   content: {
//     maxWidth: "1440px",
//     margin: "0 auto",
//     padding: "48px 16px",
//   },
//   header: {
//     marginBottom: "32px",
//   },
//   headerFlex: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "24px",
//   },
// };

const SystemMange: React.FC = () => {
  const [initModalVisible, setInitModalVisible] = useState(false); // 初始化弹窗可见状态
  const [lastSyncTime, setLastSyncTime] = useState<string>("从未同步"); // 上次同步时间
  const [syncProgress, setSyncProgress] = useState(0); // 同步进度
  const [syncModalVisible, setSyncModalVisible] = useState(false); // 同步弹窗可见状态
  const [initStatus, setInitStatus] = useState<"loading" | "success">(
    "loading"
  ); // 初始化状态
  const [syncStatus, setSyncStatus] = useState<"progress" | "success">(
    "progress"
  ); // 同步状态
  const [syncHistory, setSyncHistory] = useState<
    { time: string; status: string }[]
  >([]); // 同步历史
  const [systemStatus, setSystemStatus] = useState<
    "initialized" | "uninitialized"
  >("uninitialized"); // 系统状态
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toLocaleString()
  ); // 当前日期

  // 更新时间函数
  const updateTime = () => {
    const currentTime = new Date().toLocaleString();
    setCurrentDate(currentTime);
  };
  setInterval(updateTime, 1000);

  useEffect(() => {
    updateTime();
    // 模拟获取上次同步时间
    const mockLastSync = localStorage.getItem("lastSyncTime");
    if (mockLastSync) {
      setLastSyncTime(mockLastSync);
    }

    // 模拟获取系统状态
    const mockSystemStatus = localStorage.getItem("systemStatus");
    if (mockSystemStatus === "initialized") {
      setSystemStatus("initialized");
    }

    // 模拟获取同步历史
    const mockHistory = localStorage.getItem("syncHistory");
    if (mockHistory) {
      setSyncHistory(JSON.parse(mockHistory));
    }
  }, []);

  // 系统初始化状态
  const renderStatusBadge = () => {
    if (systemStatus === "initialized") {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f6ffed",
            color: "#52c41a",
            padding: "4px 12px",
            borderRadius: "16px",
            fontSize: "14px",
          }}
        >
          <CheckCircleOutlined style={{ marginRight: "4px" }} />
          已初始化
        </div>
      );
    }
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#fffbe6",
          color: "#faad14",
          padding: "4px 12px",
          borderRadius: "16px",
          fontSize: "14px",
        }}
      >
        <InfoCircleOutlined style={{ marginRight: "4px" }} />
        未初始化
      </div>
    );
  };

  return (
    <>
      <div className={styles.body}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.header}>
              <div className={styles.headerFlex}>
                <div>
                  <Title level={2} style={{ marginBottom: "4px" }}>
                    系统管理中心
                  </Title>
                  <Text type="secondary">今日日期: {currentDate}</Text>
                </div>
                <div>{renderStatusBadge()}</div>
              </div>
              <Divider style={{ margin: "24px 0" }} />
            </div>

            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <div style={{ marginBottom: "24px" }}>
                  <Title level={4} style={{ marginBottom: "16px" }}>
                    系统操作
                  </Title>
                  <Row gutter={[24, 24]}>
                    {/* 初始化卡片 */}
                    <Col xs={24} md={12}>
                      <InitCard
                        systemStatus={systemStatus}
                        setSystemStatus={setSystemStatus}
                        initModalVisible={initModalVisible}
                        setInitModalVisible={setInitModalVisible}
                        initStatus={initStatus}
                        setInitStatus={setInitStatus}
                      />
                    </Col>
                    {/* 数据同步卡片 */}
                    <Col xs={24} md={12}>
                      <SyncCard
                        syncHistory={syncHistory}
                        setSyncHistory={setSyncHistory}
                        lastSyncTime={lastSyncTime}
                        setLastSyncTime={setLastSyncTime}
                        syncProgress={syncProgress}
                        setSyncProgress={setSyncProgress}
                        syncStatus={syncStatus}
                        setSyncStatus={setSyncStatus}
                        syncModalVisible={syncModalVisible}
                        setSyncModalVisible={setSyncModalVisible}
                        systemStatus={systemStatus}
                      />
                    </Col>
                  </Row>
                </div>
                {/* 系统状态卡片 */}
                <SystemState
                  lastSyncTime={lastSyncTime}
                  systemStatus={systemStatus}
                  currentDate={currentDate}
                />
              </Col>
              {/* 同步历史卡片 */}
              <Col xs={24} lg={8}>
                <SyncHistory syncHistory={syncHistory} />
              </Col>
            </Row>
            <SystemInfo />
          </div>
        </div>
      </div>
    </>
  );
};

export default SystemMange;
