import { Outlet } from "react-router-dom";

import Navigation from "./Navigation/Navigation";
// import ProductPage from "./ProductPage/ProductPage";

const App = () => {
  return (
    <>
      <Navigation />
      {/* <ProductPage /> */}
      <Outlet />
    </>
  );
};

export default App;
