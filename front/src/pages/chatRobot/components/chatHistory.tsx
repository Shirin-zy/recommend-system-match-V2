import React, { useEffect, useRef } from "react";
import { Avatar, Spin } from "antd";
import {
  UserOutlined,
  RobotOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import style from "./chatHistory.less";

const avatar_list = {
  user: "https://readdy.ai/api/search-image?query=Professional%20profile%20picture%20of%20a%20young%20Asian%20person%20with%20a%20friendly%20smile%2C%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20headshot%20style%2C%20soft%20lighting%2C%20looking%20directly%20at%20camera&width=100&height=100&seq=2&orientation=squarish",
  assistant:
    "https://readdy.ai/api/search-image?query=A%20friendly%20robot%20assistant%20with%20a%20modern%20sleek%20design%2C%20blue%20glowing%20eyes%2C%20white%20and%20light%20gray%20color%20scheme%2C%20minimalist%20style%2C%20high-tech%20appearance%2C%20on%20a%20simple%20light%20background%2C%20professional%203D%20rendering&width=100&height=100&seq=1&orientation=squarish",
};

interface Message {
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  isLoading: boolean;
}

interface ChatHistoryProps {
  messages: Message[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={style.container}>
      <main className={style.warp}>
        <div className={style.chatHistory}>
          {messages.map((message) => (
            <div
              className={style.messageItem}
              key={message.timestamp}
              style={{
                alignItems: message.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div className={style.sendTime}>{message.timestamp}</div>
              <div
                className={style.message}
                style={{
                  flexDirection:
                    message.role === "user" ? "row-reverse" : "row",
                }}
              >
                <Avatar
                  className={style.avatar}
                  src={`${avatar_list[message.role]}`}
                  size={40}
                  icon={
                    message.role === "user" ? (
                      <UserOutlined />
                    ) : (
                      <RobotOutlined />
                    )
                  }
                  style={{
                    backgroundColor:
                      message.role === "user" ? "#1890ff" : "#f0f0f0",
                  }}
                />
                <div
                  className={style.text}
                  style={{
                    backgroundColor:
                      message.role === "user" ? "#1890ff" : "#f0f0f0",
                    color: message.role === "user" ? "white" : "#333",
                    borderTopLeftRadius:
                      message.role === "user" ? "12px" : "4px",
                    borderTopRightRadius:
                      message.role === "user" ? "4px" : "12px",
                  }}
                >
                  {message.isLoading ? (
                    <div>
                      <Spin
                        indicator={
                          <LoadingOutlined style={{ fontSize: 18 }} spin />
                        }
                      />
                      <span className={style.loadingText}>思考中...</span>
                    </div>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            </div>
          ))}
          {/* 用于自动滚动定位的空元素 */}
          <div ref={messagesEndRef} />
        </div>
      </main>
    </div>
  );
};

export default ChatHistory;
