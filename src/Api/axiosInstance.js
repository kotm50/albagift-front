import axios from "axios";
import { store } from "../Reducer/store"; // 스토어 가져오기

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(config => {
  // 스토어에서 accessToken 가져오기
  const { user } = store.getState();
  if (user && user.accessToken) {
    config.headers.Authorization = `${user.accessToken}`;
  }
  console.log("요청", config.headers.Authorization);
  return config;
});

axiosInstance.interceptors.response.use(
  response => {
    const newAccessToken = response.headers.authorization;
    console.log("응답", newAccessToken);
    if (newAccessToken) {
      const { user } = store.getState();
      if (newAccessToken !== `${user.accessToken}`) {
        // 스토어에 토큰 업데이트 액션 디스패치
        store.dispatch({
          type: "UPDATE_ACCESS_TOKEN",
          payload: newAccessToken,
        });
      }
    }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
