import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { store } from "./store/store.js";
import { Provider } from "react-redux";

import "./index.css";
import App from "./App.jsx";
import Product from "./Product/Product.jsx";
import ProductPage from "./ProductPage/ProductPage.jsx";
import UserPage from "./User/UserPage.jsx";
import PaymentPage from "./Payment/PaymentPage.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<ProductPage />} />
      <Route path="product/:productId" element={<Product />} />
      {/* <Route path="" element={<LandingPage />} />
      <Route path="category" element={<ProductsPage />}>
        <Route path=":category" element={<ProductsPage />} />
      </Route> */}
      <Route path="/user" element={<UserPage />} />
      <Route path="/checkout" element={<PaymentPage />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
    {/* <App /> */}
  </Provider>
);
