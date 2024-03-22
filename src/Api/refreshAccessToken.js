import axios from "axios";

export const refreshAccessToken = async user => {
  try {
    if (!user.refreshToken) {
      return "E999";
    }

    const response = await axios.post("/api/v1/common/reissu/token", {
      resolveToken: user.accessToken,
      refreshToken: user.refreshToken,
    });

    if (response.data.code === "E999") {
      return "E999";
    }

    return response.headers.authorization; // 새 accessToken 반환
  } catch (error) {
    return error.response.data;
  }
};
