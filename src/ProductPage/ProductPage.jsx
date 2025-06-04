import { useSelector } from "react-redux";

import FilterModal from "../Modals/FilterModal";
import Card from "./components/Card";
import SkeletonCard from "./components/SkeletonCard";
import Pagination from "./components/Pagination";
import SideBar from "../SideBar/SideBar";
import Recommendation from "../Recommendation/Recommendation";
import { useEffect, useState } from "react";

const ProductPage = () => {
  const base_url = import.meta.env.VITE_SERVER_URL;
  const [items, setItems] = useState([]);
  const [totalProducts, setTotalProducts] = useState(1);
  const [currPage, setCurrPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10;

  const component = useSelector((state) => state.componentValue.component);
  const brand = useSelector((state) => state.componentValue.brand);
  const minPrice = useSelector((state) => state.componentValue.minPrice);
  const maxPrice = useSelector((state) => state.componentValue.maxPrice);

  function getData() {
    setIsLoading(true);
    let url = `${base_url}/api/v1/products/?page=${currPage}&limit=${limit}`;
    if (component != "all") {
      url += `&components=${component}`;
    }
    if (brand != "all") {
      url += `&brand=${brand}`;
    }
    url += `&price=${minPrice}-`;
    if (maxPrice == 5000) {
      url += `?`;
    } else {
      url += `${maxPrice}`;
    }

    const data = fetch(url);
    data
      .then((dd) => dd.json())
      .then((dd) => {
        // console.log(dd);
        setItems(dd.data);
        setTotalProducts(Math.ceil(dd.total / limit) || 1);
      })
      .catch((err) => {
        setItems([]);
        // console.error(err);
      })
      .finally(() => setIsLoading(false));
  }

  function changePage(e) {
    if (e.target.tagName == "SPAN") {
      if (e.target.innerText != "....") setCurrPage(Number(e.target.innerText));
    }
  }

  useEffect(() => {
    setCurrPage(1);
  }, [component, brand, minPrice, maxPrice]);

  useEffect(() => {
    setIsLoading(true);
    setItems([]);
    const debouncePricing = setTimeout(() => {
      // console.log("API called!");
      getData();
    }, 300);
    return () => clearTimeout(debouncePricing);
    // getData();
  }, [component, brand, currPage, minPrice, maxPrice]);

  return (
    <>
      <FilterModal handlePrice={getData} />
      <div className="flex flex-1 w-full dark:bg-slate-800 dark:text-white">
        <SideBar handlePrice={getData} />
        <div className="p-4 flex flex-col flex-1">
          <Recommendation />
          {/* Page Bar */}
          <Pagination
            currPage={currPage}
            totalProducts={totalProducts}
            changePage={changePage}
          />

          <div
            className="flex-1 grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-x-2 gap-y-4 pb-52"
            id="container"
          >
            {items.length && !isLoading
              ? items.map((item) => (
                  <Card
                    key={item._id}
                    id={item._id}
                    imgSrc={item.imageCover}
                    title={item.name}
                    reviewNo={item.reviews.length}
                    defaultPrice={item.prevPrice}
                    currPrice={item.currPrice}
                  />
                ))
              : isLoading
              ? [...Array(5)].map((_, idx) => <SkeletonCard key={idx} />)
              : "No Items Found!"}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
