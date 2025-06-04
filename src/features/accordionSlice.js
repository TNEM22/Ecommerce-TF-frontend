import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selected: "1",
};

export const accordionSlice = createSlice({
  name: "Accordion",
  initialState,
  reducers: {
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
  },
});

export const { setSelected } = accordionSlice.actions;

export default accordionSlice.reducer;
