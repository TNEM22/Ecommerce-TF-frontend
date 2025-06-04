import { configureStore } from "@reduxjs/toolkit";
import cartItemsCounterReducer from "../features/counter/cartItemsCounterSlice";
import filterModalReducer from "../features/modal/filterModalSlice";
import authModalReducer from "../features/modal/authModalSlice";
import filterReducer from "../features/filter/filterSlice";
import authReducer from "../features/authSlice";
import accordionReducer from "../features/accordionSlice";

export const store = configureStore({
  reducer: {
    cartItemsCounter: cartItemsCounterReducer,
    filterModal: filterModalReducer,
    componentValue: filterReducer,
    authModal: authModalReducer,
    auth: authReducer,
    accordion: accordionReducer,
  },
});
