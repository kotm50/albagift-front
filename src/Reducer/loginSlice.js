import { createSlice } from "@reduxjs/toolkit";

const locginSlice = createSlice({
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

export const { saveId } = locginSlice.actions;
export default locginSlice.reducer;
