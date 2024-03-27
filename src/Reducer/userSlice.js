import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 비동기 액션 생성
export const refreshAccessToken = createAsyncThunk(
  "user/refreshAccessToken",
  async (_, { getState }) => {
    const { user } = getState();
    try {
      if (!user.accessToken) {
        return alert("accErr : 로그인을 다시 진행해 주세요");
      }
      if (!user.refreshToken) {
        return alert("refErr : 로그인을 다시 진행해 주세요");
      }

      const response = await axios.post("/api/v1/common/reissu/token", {
        resolveToken: user.accessToken,
        refreshToken: user.refreshToken,
      });
      //console.log("재발급API", response.data);
      if (response.data.code === "C000") {
        // 정상적으로 새 토큰을 받았을 때
        return response.headers.authorization; // 새 accessToken 반환
      } else {
        //console.log(response.headers);
        return "E999";
      }
    } catch (error) {
      console.log(error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: "",
    userName: "",
    accessToken: "",
    refreshToken: "",
    admin: false,
  },
  reducers: {
    loginUser: (state, action) => {
      state.userId = action.payload.userId;
      state.userName = action.payload.userName;
      state.accessToken = action.payload.accessToken;
      state.admin = action.payload.admin;
      state.refreshToken = action.payload.refreshToken;
    },
    clearUser: state => {
      state.userId = "";
      state.userName = "";
      state.accessToken = "";
      state.admin = false;
      state.refreshToken = "";
    },
    refreshPoint: (state, action) => {
      state.point = action.payload.point;
    },
    buyGift: (state, action) => {
      state.point = action.payload.point;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        if (action.payload === "E999") {
          // E999 오류 발생 시 clearUser 실행
          userSlice.caseReducers.clearUser(state);
        } else {
          state.accessToken = action.payload; // accessToken 업데이트
        }
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        // 기타 오류 코드 처리
        console.log("Error:", action.payload);
      });
  },
});

export const { loginUser, clearUser, refreshPoint, buyGift } =
  userSlice.actions;
export default userSlice.reducer;
