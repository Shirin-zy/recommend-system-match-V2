import React, { useState, useEffect } from "react";
import { Card, Button, Typography, Modal, Progress } from "antd";
import style from "./syncCard.less";
import {
  SyncOutlined,
  CloudSyncOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { set } from "mobx";

const { Title, Paragraph } = Typography;

interface SyncCardProps {
  syncHistory: { time: string; status: string }[]; // 同步历史
  setSyncHistory: (history: { time: string; status: string }[]) => void;
  lastSyncTime: string; // 上次同步时间
  setLastSyncTime: (time: string) => void;
  syncProgress: number; // 同步进度
  setSyncProgress: (progress: number) => void;
  syncStatus: "progress" | "success"; // 同步状态
  setSyncStatus: (status: "progress" | "success") => void;
  syncModalVisible: boolean; // 同步弹窗可见状态
  setSyncModalVisible: (visible: boolean) => void;
  systemStatus: "initialized" | "uninitialized"; // 系统状态
}

const SyncCard = ({
  syncHistory,
  setSyncHistory,
  lastSyncTime,
  setLastSyncTime,
  syncProgress,
  setSyncProgress,
  syncStatus,
  setSyncStatus,
  syncModalVisible,
  setSyncModalVisible,
  systemStatus,
}: SyncCardProps) => {
  const [completeMessage, setCompleteMessage] = useState<string>("");
  const startSync = () => {
    // 链接到scoket
    const sckoet = new WebSocket("ws://127.0.0.1:5000/progress");
    // 监听连接打开事件
    sckoet.onopen = () => {
      console.log("连接已建立");
      setSyncModalVisible(true);
      setSyncStatus("progress");
      setSyncProgress(0);
    };
    // 监听消息事件
    sckoet.onmessage = (event) => {
      const data = event.data;
      console.log("收到服务器消息:", data);
      if (data === "complete") {
        setSyncStatus("success");
        const now = new Date().toLocaleString();
        // 设置最后同步时间并缓存
        setLastSyncTime(now);
        localStorage.setItem("lastSyncTime", now);
        // 更新同步历史
        const newHistory = [
          { time: now, status: "成功" },
          ...syncHistory,
        ].slice(0, 5);
        setSyncHistory(newHistory);
        localStorage.setItem("syncHistory", JSON.stringify(newHistory));
        setCompleteMessage("所有数据已成功同步，系统数据已是最新状态。");
        return;
      }
      setSyncProgress(data);
    };

    // 监听连接关闭事件
    sckoet.onclose = () => {
      console.log("连接已关闭");
    };
  };

  return (
    <>
      {" "}
      <Card className={style.card} bodyStyle={{ height: "100%" }}>
        <div className={style.flexColumn}>
          <div className={style.cardHeader}>
            <div className={style.iconContainer}>
              <CloudSyncOutlined className={style.greenIcon} />
            </div>
            <Title level={4} style={{ margin: 0 }}>
              数据同步
            </Title>
          </div>

          <Paragraph className={style.cardContent}>
            通过数据同步功能，您可以确保系统中的数据保持最新状态。
            同步过程将会更新所有模块的数据，包括用户信息、业务数据等。
          </Paragraph>

          <div className={style.cardFooter}>
            <Button
              type="primary"
              size="large"
              icon={<SyncOutlined />}
              onClick={startSync}
              disabled={systemStatus !== "initialized"}
              className="!rounded-button whitespace-nowrap cursor-pointer"
              block
            >
              开始同步
            </Button>
            <div className={style.lastSyncText}>
              <HistoryOutlined className={style.historyIcon} />
              上次同步时间: {lastSyncTime}
            </div>
          </div>
        </div>
      </Card>
      {/* 同步模态框 */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <CloudSyncOutlined
              style={{ marginRight: "8px", color: "#52c41a" }}
            />
            数据同步
          </div>
        }
        open={syncModalVisible}
        footer={[
          <Button
            key="ok"
            type="primary"
            onClick={() => setSyncModalVisible(false)}
            disabled={syncStatus === "progress"}
            className="!rounded-button whitespace-nowrap cursor-pointer"
          >
            确认
          </Button>,
        ]}
        onCancel={() => syncStatus === "success" && setSyncModalVisible(false)}
        closable={syncStatus === "success"}
        maskClosable={false}
        centered
        width={480}
      >
        <div className={style.modalContent}>
          {syncStatus === "progress" ? (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <SyncOutlined spin style={{ fontSize: 64, color: "#1890ff" }} />
              </div>
              <Title level={4} style={{ marginBottom: "16px" }}>
                数据同步中
              </Title>
              <div className={style.modalProgress}>
                <Progress percent={syncProgress} status="active" />
              </div>
              <Paragraph style={{ color: "#999" }}>
                正在同步数据，请勿关闭窗口...
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
                数据同步完成！
              </Title>
              <Paragraph style={{ color: "#999" }}>{completeMessage}</Paragraph>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default SyncCard;
