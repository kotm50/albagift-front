import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "login",
  initialState: {
    saveId: "",
  },
  reducers: {
    saveId: (state, action) => {
      state.saveId = action.payload.saveId;
    },
  },
});

export const { saveId } = loginSlice.actions;
export default loginSlice.reducer;
