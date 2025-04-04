import { jwtDecode } from "jwt-decode";

// 假设这是你的JWT令牌
const token = "your.jwt.token.here";

try {
  // 解码token
  const decoded = jwtDecode(token);
  console.log(decoded);
  // 输出将是一个对象，包含了payload中的所有声明
} catch (err) {
  // 处理解码错误
  console.error("Failed to decode token:", err);
}

const decodeToken = (token: string) => {
  if (token === "") {
    return "expired";
  }
  const decoded = jwtDecode(token) as { exp?: number };
  if (decoded.exp !== undefined && decoded.exp < Date.now() / 1000) {
    return "expired";
  } else {
    return "valid";
  }
};

export default decodeToken;
