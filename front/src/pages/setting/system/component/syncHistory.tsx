import React, { useState } from "react";
import { Card, Typography, Timeline } from "antd";
import { HistoryOutlined } from "@ant-design/icons";
const { Title, Paragraph, Text } = Typography;

interface SyncHistoryProps {
  syncHistory: { time: string; status: string }[]; // 同步历史
}

const SyncHistory = ({ syncHistory }: SyncHistoryProps) => {
  return (
    <>
      {" "}
      <Card
        style={{
          height: "100%",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
        }}
      >
        <Title level={4} style={{ marginBottom: "16px" }}>
          同步历史记录
        </Title>
        {syncHistory.length > 0 ? (
          <Timeline
            items={syncHistory.map((item, index) => ({
              color: "green",
              children: (
                <div key={index}>
                  <div style={{ fontWeight: 500 }}>{item.status}</div>
                  <div style={{ color: "#999", fontSize: "14px" }}>
                    {item.time}
                  </div>
                </div>
              ),
            }))}
          />
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "32px 0",
              color: "#999",
            }}
          >
            <HistoryOutlined
              style={{ fontSize: "36px", marginBottom: "12px", opacity: "0.5" }}
            />
            <p>暂无同步历史记录</p>
          </div>
        )}
      </Card>
    </>
  );
};

export default SyncHistory;
