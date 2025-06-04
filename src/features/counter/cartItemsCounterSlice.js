import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

export const cartItemsCounterSlice = createSlice({
  name: "Cart Items Count",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      if (state.value > 1) state.value -= 1;
    },
    setCartItemsCount: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { increment, decrement, setCartItemsCount } =
  cartItemsCounterSlice.actions;

export default cartItemsCounterSlice.reducer;
