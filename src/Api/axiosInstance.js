import axios from "axios";
import { store } from "../Reducer/store"; // 스토어 가져오기
import { refreshAccessToken } from "../Reducer/userSlice"; // 비동기 액션 생성 함수
import { clearUser } from "../Reducer/userSlice"; // clearUser 액션 추가

const axiosInstance = axios.create();

let isRefreshing = false;

const requestQueue = []; // 요청 대기열 추가

const processQueue = (error, token = null) => {
  while (requestQueue.length) {
    const { resolve, reject } = requestQueue.shift();
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  }
};

//eslint-disable-next-line
let refreshTokenPromise = null;

axiosInstance.interceptors.response.use(
  async response => {
    if (response.data.code === "E401") {
      const originalRequest = response.config;
      if (!isRefreshing && !refreshTokenPromise) {
        // refreshTokenPromise가 없는 경우에만 실행
        isRefreshing = true;
        refreshTokenPromise = store
          .dispatch(refreshAccessToken())
          .unwrap()
          .then(newAccessToken => {
            if (newAccessToken) {
              axiosInstance.defaults.headers.common["Authorization"] =
                newAccessToken;
              originalRequest.headers["Authorization"] = newAccessToken;
              processQueue(null, newAccessToken);
              return newAccessToken;
            } else {
              // Redux clearUser 호출
              store.dispatch(clearUser());
              return false;
            }
          })
          .catch(error => {
            // Redux clearUser 호출
            store.dispatch(clearUser());
            return Promise.reject({ message: "E999" });
          })
          .finally(() => {
            isRefreshing = false;
            refreshTokenPromise = null;
          });
      }

      /*
      const retryOriginalRequest = new Promise((resolve, reject) => {
        requestQueue.push({ resolve, reject });
      });
      */

      return refreshTokenPromise.then(token => {
        // 이미 생성된 refreshTokenPromise 사용
        originalRequest.headers["Authorization"] = token;
        return axiosInstance(originalRequest);
      });
    } else if (response.data.code === "E403") {
      // 에러 응답 처리
      store.dispatch(clearUser()); // 동일한 함수 실행
      window.location.href = "/"; // 메인 화면으로 이동
      return Promise.reject(); // 다른 핸들러에게 에러 전달
    } else if (response.data.code === "E999") {
      // 에러 응답 처리
      store.dispatch(clearUser()); // 동일한 함수 실행
      window.location.href = "/"; // 메인 화면으로 이동
      return Promise.reject(); // 다른 핸들러에게 에러 전달
    }
    return response;
  },
  error => {
    // 에러 응답 처리
    store.dispatch(clearUser()); // 동일한 함수 실행
    window.location.href = "/"; // 메인 화면으로 이동
    return Promise.reject(error); // 다른 핸들러에게 에러 전달
  }
);

export default axiosInstance;
