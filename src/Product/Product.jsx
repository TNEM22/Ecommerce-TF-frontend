import { lazy, useEffect, useState, useRef, Suspense } from "react";
import { useParams } from "react-router-dom";
import { IoMdStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import { useDispatch } from "react-redux";

import {
  increment,
  decrement,
} from "../features/counter/cartItemsCounterSlice";
import { changeAuthState } from "../features/modal/authModalSlice";

import Card from "../ProductPage/components/Card";
import ReviewForm from "./components/ReviewForm";
// import ReviewCard from "./components/ReviewCard";
const ReviewCard = lazy(() => import("./components/ReviewCard"));

const Product = () => {
  const { productId } = useParams();
  // console.log(productId);
  const base_url = import.meta.env.VITE_SERVER_URL;

  const [count, setCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  function addCartItemHandler() {
    setIsSubmitting(true);
    const token = localStorage.token;

    if (!token) {
      dispatch(changeAuthState("login"));
      setIsSubmitting(false);
      return;
    }

    const url = `${base_url}/api/v1/users/cart/add`;
    const data = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.token,
        productId: productId,
      }),
    });
    data
      .then((dd) => dd.json())
      .then((dd) => {
        // console.log(dd);
        if (dd.status == "error") return;
        dispatch(increment());
        setCount(dd.data.count);
      })
      .catch((err) => console.log(err))
      .finally(() => setTimeout(() => setIsSubmitting(false), 300));
  }

  function deleteCartItemHandler() {
    setIsSubmitting(true);
    const token = localStorage.token;

    if (!token) {
      dispatch(changeAuthState("login"));
      setIsSubmitting(false);
      return;
    }

    const url = `${base_url}/api/v1/users/cart/delete`;
    const data = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.token,
        productId: productId,
      }),
    });
    data
      .then((dd) => dd.json())
      .then((dd) => {
        // console.log(dd);
        if (dd.status == "error") return;
        dispatch(decrement());
        setCount(dd.data.count);
      })
      .catch((err) => console.log(err))
      .finally(() => setTimeout(() => setIsSubmitting(false), 300));
  }

  const [product, setProduct] = useState(null);
  const [suggestedProduct, setSuggestedProduct] = useState(null);
  const [mainPhotoSrc, setMainPhotoSrc] = useState(null);

  const reviewRef = useRef(null);
  const [loadReview, setLoadReview] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // console.log("Entry observed:", entry);
        if (entry.isIntersecting) {
          setLoadReview(true);
          observer.disconnect(); // Stop observing after loading
        }
      },
      { threshold: 0.01 } // Trigger when 1% of the component is visible
    );
    if (reviewRef.current) observer.observe(reviewRef.current);

    return () => observer.disconnect();
  });

  async function getSuggestions(product) {
    let url = `${base_url}/api/v1/products/?limit=3&excludeProductId=${product._id}`;
    await product.components.forEach((e) => {
      url += `&components=${e}`;
    });

    const data = fetch(url);
    data
      .then((dd) => dd.json())
      .then((dd) => {
        // console.log(dd);
        setSuggestedProduct(dd.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function getData() {
    let url = `${base_url}/api/v1/products/${productId}`;

    const data = fetch(url);
    data
      .then((dd) => dd.json())
      .then((dd) => {
        // console.log(dd);
        setProduct(dd.data);
        setMainPhotoSrc(dd.data.imageCover);
        getSuggestions(dd.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    getData();
  }, [productId]);

  function handleImageChange(event) {
    // console.log(event.target);
    setMainPhotoSrc(event.target.src);
  }

  return product != null ? (
    <div className="dark:bg-slate-800 dark:text-white">
      {/* Product */}
      <div className="px-4 pt-4 md:flex">
        {/* Product Images */}
        <div className="flex flex-1 flex-col-reverse md:flex-row">
          {/* Image Array */}
          <div className="flex md:block flex-nowrap overflow-x-auto items-center basis-1/4 xl:basis-1/6">
            <div
              className={
                product.imageCover == mainPhotoSrc
                  ? "border-2 border-blue-500 p-1 min-w-[100px] max-w-[100px] md:w-fit mb-2 rounded-lg h-auto md:h-fit"
                  : "border-2 border-transparent p-1 min-w-[100px] max-w-[100px] md:w-fit mb-2 rounded-lg h-auto md:h-fit"
              }
            >
              <img
                src={product.imageCover}
                alt={product.name}
                onClick={handleImageChange}
                className="rounded-lg cursor-pointer object-contain max-h-full w-full"
              />
            </div>
            {product.image.map((ele) => (
              <div
                key={ele}
                className={
                  ele == mainPhotoSrc
                    ? "border-2 border-blue-500 p-1 min-w-[100px] max-w-[100px] md:w-fit my-2 rounded-lg h-auto md:h-fit"
                    : "border-2 border-transparent p-1 min-w-[100px] max-w-[100px] md:w-fit my-2 rounded-lg h-auto md:h-fit"
                }
              >
                <img
                  src={ele}
                  alt={product.name}
                  onClick={handleImageChange}
                  className="rounded-lg cursor-pointer object-contain max-h-full w-full"
                />
              </div>
            ))}
          </div>
          {/* Main Image */}
          <div className="flex-1 h-full">
            <img
              src={mainPhotoSrc}
              alt={product.name}
              className="h-[300px] md:h-[500px] w-full ml-1 border-2 border-slate-400 object-contain"
            />
          </div>
        </div>
        {/* Product Details */}
        <div className="flex flex-col flex-1 md:ml-4 mt-4 md:mt-0">
          <div className="text-2xl w-full">{product.name}</div>
          <div className="text-blue-800 dark:text-blue-200">
            Brand: {product.brand}
          </div>
          <div className="flex w-full items-center border-b-2 border-slate-300">
            <span className="flex ">
              {product.ratingsAverage}
              <span className="flex text-sm ml-1 items-center" id="stars">
                <IoMdStar />
                <IoMdStar />
                <IoMdStar />
                <IoIosStarHalf />
                <IoIosStarOutline />
              </span>
            </span>
            <span className="text-sm ml-8" id="reviews">
              {product.ratingsQuantity} reviews
            </span>
          </div>
          <div className="flex flex-col mt-4">
            <div className="flex items-baseline">
              <div className="text-lg bg-red-600 text-white w-fit h-fit px-2 rounded-lg font-semibold">
                -
                {Math.ceil(
                  100 - (product.currPrice / product.actualPrice) * 100
                )}
                %
              </div>
              <div className="font-semibold ml-2 text-lg">₹</div>
              <div className="font-bold text-2xl">{product.currPrice}</div>
            </div>
            <div className="text-sm text-slate-800 dark:text-white mt-1 font-semibold">
              M.R.P.:
              <span className="line-through">₹{product.actualPrice}</span>
            </div>
          </div>
          <div className="mt-3 flex flex-col">
            <span className="font-semibold">About the Product:</span>
            <span>{product.desc}</span>
          </div>
          <button
            className={
              !count
                ? "text-lg flex mt-10 items-center justify-center h-[40px] w-full text-center rounded-full bg-yellow-300 hover:bg-yellow-400 active:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:active:bg-yellow-500 border-4 border-white dark:border-slate-800 dark:font-bold"
                : "text-lg flex mt-10 items-center justify-center h-[40px] w-full text-center rounded-full border-4 border-yellow-300 dark:border-yellow-600 dark:font-bold"
            }
            id="add2cart"
          >
            {isSubmitting ? (
              <svg
                className="animate-spin mr-1 h-5 w-5 dark:text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : !count ? (
              <span onClick={addCartItemHandler}>Add to Cart</span>
            ) : (
              <span className="flex w-full justify-between items-center">
                <span
                  className="px-2 rounded-full font-black text-2xl pb-2"
                  onClick={deleteCartItemHandler}
                >
                  -
                </span>
                <span>{count}</span>
                <span
                  className="px-2 rounded-full font-black text-2xl pb-1"
                  onClick={addCartItemHandler}
                >
                  +
                </span>
              </span>
            )}
          </button>
        </div>
      </div>
      {/* Suggestions */}
      <div className="flex items-center justify-center flex-col">
        <div className="font-bold text-2xl my-4 underline underline-offset-4">
          Suggestions
        </div>
        <div className="flex justify-center md:w-4/6 px-8">
          <div className="grid md:grid-cols-3 grid-rows-1 gap-3">
            {suggestedProduct != null ? (
              suggestedProduct.map((item) => (
                <Card
                  key={item._id}
                  id={item._id}
                  imgSrc={item.imageCover}
                  title={item.name}
                  reviewNo={item.reviews.length}
                  defaultPrice={item.prevPrice}
                  currPrice={item.currPrice}
                  cartOnClickHandler={() => dispatch(increment())}
                />
              ))
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      </div>
      {/* Review Form */}
      <ReviewForm reviewRef={reviewRef} productId={productId} />
      {/* <div className="h-1"></div> */}
      {/* Review */}
      {loadReview && (
        <Suspense fallback={<div>Loading Reviews...</div>}>
          <ReviewCard productId={productId} />
        </Suspense>
      )}
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default Product;
