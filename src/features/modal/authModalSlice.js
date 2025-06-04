import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authState: null,
};

export const authModalSlice = createSlice({
  name: "Auth Modal State",
  initialState,
  reducers: {
    changeAuthState: (state, action) => {
      state.authState = action.payload;
    },
  },
});

export const { changeAuthState } = authModalSlice.actions;

export default authModalSlice.reducer;
