import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 비동기 액션 생성
export const refreshAccessToken = createAsyncThunk(
  "user/refreshAccessToken",
  async (_, { getState, rejectWithValue }) => {
    const { user } = getState();
    try {
      const response = await axios.post("/api/v1/common/reissu/token", {
        resolveToken: user.accessToken,
        refreshToken: user.refreshToken,
      });
      if (response.data.code === "E999") {
        // 오류 코드 E999 처리
        return rejectWithValue("E999");
      }
      return response.headers.authorization; // 새 accessToken 반환
    } catch (error) {
      return rejectWithValue(error.response.data);
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
        state.accessToken = action.payload; // accessToken 업데이트
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        if (action.payload === "E999") {
          // E999 오류 발생 시 clearUser 실행
          userSlice.caseReducers.clearUser(state);
        }
      });
  },
});

export const { loginUser, clearUser, refreshPoint, buyGift } =
  userSlice.actions;
export default userSlice.reducer;
