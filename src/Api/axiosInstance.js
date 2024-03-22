import axios from "axios";
import { store } from "../Reducer/store"; // 스토어 가져오기
import { refreshAccessToken } from "../Reducer/userSlice"; // 비동기 액션 생성 함수

const axiosInstance = axios.create();

let isRefreshing = false;
let refreshTokenPromise = null;

/*
axiosInstance.interceptors.request.use(
  config => {
    // API URL 출력
    console.log(`Request URL: ${config.url}`);

    // Authorization 헤더의 맨 끝 5글자 출력
    const authToken =
      config.headers.Authorization || config.headers.authorization;
    if (authToken) {
      const tokenEnd = authToken.slice(-5);
      console.log(`Authorization: ...${tokenEnd}`);
    }

    return config;
  },
  error => {
    // 요청 에러 처리
    return Promise.reject(error);
  }
);
*/
axiosInstance.interceptors.response.use(
  async response => {
    console.log(response.data);
    if (response.data.code === "E401") {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenPromise = store
          .dispatch(refreshAccessToken())
          .unwrap()
          .finally(() => {
            isRefreshing = false;
            refreshTokenPromise = null;
          });
      }

      try {
        const newAccessToken = await refreshTokenPromise;
        axiosInstance.defaults.headers.common["Authorization"] = newAccessToken;
        response.config.headers["Authorization"] = newAccessToken;
        return axiosInstance(response.config);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return response;
  },
  error => {
    // 오류 처리
    return Promise.reject(error);
  }
);

export default axiosInstance;
