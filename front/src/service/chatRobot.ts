import { axiosInstance } from "@/utlis/axios";

interface Message {
  role: "assistant" | "user";
  content: string;
}
const getRobotReply = (context: Message[]) => {
  try {
    const response = axiosInstance.post("/api/chatRobot", {
      context,
    });
    return response;
  } catch (error) {
    console.error("获取聊天机器人答案:", error);
    throw error;
  }
};

export { getRobotReply };
