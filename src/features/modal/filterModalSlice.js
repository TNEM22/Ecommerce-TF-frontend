import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

export const filterModalSlice = createSlice({
  name: "Filter Modal State",
  initialState,
  reducers: {
    change: (state) => {
      if (state.value) {
        state.value = false;
      } else {
        state.value = true;
      }
    },
  },
});

export const { change } = filterModalSlice.actions;

export default filterModalSlice.reducer;
