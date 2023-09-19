import { createSlice } from "@reduxjs/toolkit";

const kakaoSlice = createSlice({
  name: "kakao",
  initialState: {
    id: "",
    email: "",
    socialType: "",
  },
  reducers: {
    inputKakao: (state, action) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.socialType = action.payload.socialType;
    },
    clearKakao: state => {
      state.id = "";
      state.email = "";
      state.socialType = "";
    },
  },
});

export const { inputKakao, clearKakao } = kakaoSlice.actions;
export default kakaoSlice.reducer;
