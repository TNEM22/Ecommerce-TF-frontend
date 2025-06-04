import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
};

export const authSlice = createSlice({
  name: "Auth State",
  initialState,
  reducers: {
    changeAuthToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { changeAuthToken } = authSlice.actions;

export default authSlice.reducer;
