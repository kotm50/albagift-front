import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    oneDay: "N",
    lastOpen: "",
  },
  reducers: {
    dayModal: (state, action) => {
      state.oneDay = action.payload.oneDay;
      state.lastOpen = action.payload.lastOpen;
    },
  },
});

export const { dayModal } = modalSlice.actions;
export default modalSlice.reducer;
