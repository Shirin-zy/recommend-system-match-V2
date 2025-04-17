import React, { useState } from "react";
import Draggable from "react-draggable";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import style from "./index.less";
import { DeleteOutlined, SendOutlined, TwitchFilled } from "@ant-design/icons";
import { Input, Button } from "antd";
import ChatHistory from "./components/chatHistory";
import { getRobotReply } from "@/service/chatRobot";

interface ChatRobotProps {
  close: () => void; // 正确的参数定义
}

interface Message {
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  isLoading: boolean;
}

// 获取当前时间并格式化为HH:MM
function getCurrentTimeFormatted(): string {
  const now = new Date();
  // 获取小时数 (0-23)
  const hours = now.getHours().toString().padStart(2, "0");
  // 获取分钟数 (0-59)
  const minutes = now.getMinutes().toString().padStart(2, "0");
  // 返回格式化的时间字符串
  return `${hours}:${minutes}`;
}

const ChatRobot: React.FC<ChatRobotProps> = ({ close }) => {
  const [size, setSize] = useState({ width: 900, height: 600 }); // 窗口大小
  const [position, setPosition] = useState({ x: 500, y: -800 }); // 窗口位置
  const [inputMessage, setInputMessage] = useState(""); // 输入框内容
  const [inputDisabled, setInputDisabled] = useState(false); // 控制输入框是否禁用
  const [messages, setMessages] = useState<Message[]>([]); // 聊天记录

  // 获取机器人回复
  const getReply = async (messages: any[]) => {
    try {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "",
          timestamp: getCurrentTimeFormatted(),
          isLoading: true,
        },
      ]);
      const res = await getRobotReply(messages);
      setMessages((prev) => {
        if (prev.length === 0) return prev;
        return prev.map((message, index) => {
          if (index === prev.length - 1) {
            return {
              ...message,
              isLoading: false,
              content: res.data.data.context,
            };
          }
          return message;
        });
      });
      setInputDisabled(false);
      console.log(res);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // 处理用户发送消息
  const handleSendMessage = () => {
    setInputDisabled(true);
    const messageItem: Message = {
      role: "user",
      content: inputMessage,
      timestamp: getCurrentTimeFormatted(),
      isLoading: false,
    };
    // 点击发送后情况输入框
    setInputMessage("");
    setMessages((prevMessages) => [...prevMessages, messageItem]);
    // 获取机器人回复
    getReply(
      [...messages, messageItem].map(({ role, content }) => ({
        role,
        content,
      }))
    );
  };

  const MIN_WIDTH = 900;
  const MIN_HEIGHT = 600;
  const MAX_WIDTH = 1350;
  const MAX_HEIGHT = 900;

  // 限制最小最大尺寸
  const handleResize = (e, { size }) => {
    const newWidth = Math.max(MIN_WIDTH, Math.min(size.width, MAX_WIDTH));
    const newHeight = Math.max(MIN_HEIGHT, Math.min(size.height, MAX_HEIGHT));
    setSize({ width: newWidth, height: newHeight });
  };

  // 处理拖动事件
  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  return (
    <Draggable
      handle=".drag-handle"
      defaultPosition={{ x: 0, y: 0 }}
      position={position}
      onDrag={handleDrag}
    >
      <div className={style.content}>
        <Resizable
          width={size.width}
          height={size.height}
          onResize={handleResize}
        >
          <div
            style={{
              width: size.width,
              height: size.height,
            }}
            className={style.chatRobot}
          >
            <div className={style.side}></div>
            <div className={style.body}>
              <div className={`${style.header} drag-handle`}>
                <span>当前会话记录</span>
                <DeleteOutlined className={style.close} onClick={close} />
              </div>
              <div className={style.middle}>
                {messages.length > 0 && <ChatHistory messages={messages} />}
                {messages.length === 0 && (
                  <div className={style.noChat}>
                    <TwitchFilled className={style.icon} />
                    <span className={style.info}>开始一个新的对话</span>
                    <span className={style.subInfo}>
                      您可以询问我任何问题，从学术知识到日常建议，我都会尽力为您提供帮助。
                    </span>
                  </div>
                )}
              </div>
              <div className={style.footer}>
                {/* 输入框 */}
                <div>
                  {" "}
                  <Input.TextArea
                    disabled={inputDisabled}
                    placeholder="输入您的问题..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onPressEnter={(e) => {
                      if (!e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    className={style.input}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    className="ml-2 !rounded-button whitespace-nowrap"
                    style={{ backgroundColor: "#359eff" }}
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                  />
                </div>
                <span className={style.tips}>
                  按 Enter 发送，Shift + Enter 换行
                </span>
              </div>
            </div>
          </div>
        </Resizable>
      </div>
    </Draggable>
  );
};

export default ChatRobot;
