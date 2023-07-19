import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: "",
    accessToken: "",
    lastLogin: "",
    admin: false,
    point: 0,
  },
  reducers: {
    loginUser: (state, action) => {
      state.userId = action.payload.userId;
      state.accessToken = action.payload.accessToken;
      state.lastLogin = action.payload.lastLogin;
      state.admin = action.payload.admin;
      state.point = action.payload.point;
    },
    clearUser: state => {
      state.userId = "";
      state.accessToken = "";
      state.lastLogin = "";
      state.admin = false;
      state.point = 0;
    },
    getNewToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
    },
    buyGift: (state, action) => {
      state.point = action.payload.point;
    },
  },
});

export const { loginUser, clearUser, buyGift, getNewToken } = userSlice.actions;
export default userSlice.reducer;
