import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: "",
    userName: "",
    accessToken: "",
    lastLogin: "",
    admin: false,
    point: 0,
  },
  reducers: {
    loginUser: (state, action) => {
      state.userId = action.payload.userId;
      state.userName = action.payload.userName;
      state.accessToken = action.payload.accessToken;
      state.lastLogin = action.payload.lastLogin;
      state.admin = action.payload.admin;
      state.point = action.payload.point;
    },
    clearUser: state => {
      state.userId = "";
      state.userName = "";
      state.accessToken = "";
      state.lastLogin = "";
      state.admin = false;
      state.point = 0;
    },
    getNewToken: (state, action) => {
      return { ...state, accessToken: action.payload.accessToken };
    },
    refreshPoint: (state, action) => {
      state.point = action.payload.point;
    },
    buyGift: (state, action) => {
      state.point = action.payload.point;
    },
  },
});

export const { loginUser, clearUser, buyGift, getNewToken, refreshPoint } =
  userSlice.actions;
export default userSlice.reducer;
