import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getNewToken } from "../Reducer/userSlice";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  config => {
    const currentAccessToken = config.headers.authorization;
    const user = useSelector(state => state.user);
    console.log(user.accessToken === currentAccessToken);
    // 여기서 필요한 작업을 수행하고 config을 반환합니다.
    console.log(config);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    const user = useSelector(state => state.user);
    // 여기서 response.headers.authorization을 가져옵니다.
    const newAccessToken = response.headers.authorization;

    // 만약 새로운 토큰이 존재하고, 현재 토큰과 다르다면 Redux를 통해 갱신합니다.
    if (newAccessToken && newAccessToken !== user.accessToken) {
      const dispatch = useDispatch(); // useDispatch를 사용하여 디스패치를 가져옵니다. 이는 React 컴포넌트 내에서만 사용 가능합니다.
      dispatch(getNewToken({ accessToken: newAccessToken }));
      console.log("토큰갱신");
    } else {
      console.log("토큰유지");
    }

    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
