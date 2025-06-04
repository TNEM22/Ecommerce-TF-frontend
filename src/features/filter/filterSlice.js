import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  component: "all",
  brand: "all",
  minPrice: 0,
  maxPrice: 5000,
};

export const filterSlice = createSlice({
  name: "Component State",
  initialState,
  reducers: {
    setComponent: (state, action) => {
      state.component = action.payload;
    },
    setMinPrice: (state, action) => {
      state.minPrice = action.payload;
    },
    setMaxPrice: (state, action) => {
      state.maxPrice = action.payload;
    },
    setBrand: (state, action) => {
      state.brand = action.payload;
    },
  },
});

export const { setComponent, setMinPrice, setMaxPrice, setBrand } =
  filterSlice.actions;

export default filterSlice.reducer;
