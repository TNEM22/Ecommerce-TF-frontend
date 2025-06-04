import { useState } from "react";
import { useDispatch } from "react-redux";

import { FaImage } from "react-icons/fa6";
import { IoMdStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";

import {
  increment,
  decrement,
} from "../../features/counter/cartItemsCounterSlice";

const Card = ({ product, removeCartItem, setTotalPrice }) => {
  // console.log(product._id);
  const base_url = import.meta.env.VITE_SERVER_URL;
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [count, setCount] = useState(product.count);

  const id = product._id;
  const imgSrc = product.imageCover;
  const title = product.name;
  const reviewNo = product.ratingsQuantity;
  const currPrice = product.currPrice;

  function deleteCartItemHandler() {
    if (count <= 0) return;
    setIsSubmitting(true);
    const url = `${base_url}/api/v1/users/cart/delete`;
    const data = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.token,
        productId: id,
      }),
    });
    data
      .then((dd) => dd.json())
      .then((dd) => {
        // console.log(dd);
        if (dd.status == "error") return;
        dispatch(decrement());
        setCount(count - 1);
        if (count <= 1) {
          removeCartItem(product._id);
        } else {
          setTotalPrice((prevTotalPrice) => prevTotalPrice - currPrice);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setTimeout(() => setIsSubmitting(false), 300));
  }

  function addCartItemHandler() {
    setIsSubmitting(true);

    const url = `${base_url}/api/v1/users/cart/add`;
    const data = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.token,
        productId: id,
      }),
    });
    data
      .then((dd) => dd.json())
      .then((dd) => {
        console.log(dd);
        if (dd.status == "error") return;
        dispatch(increment());
        setCount(dd.data.count);
        setTotalPrice((prevTotalPrice) => prevTotalPrice + currPrice);
      })
      .catch((err) => console.log(err))
      .finally(() => setTimeout(() => setIsSubmitting(false), 300));
  }

  return (
    <div className="w-full hover:border-slate-300 border-2 flex hover:shadow-md items-center">
      <div className="h-full border-b-slate-100 border-r-2 basis-full flex items-center justify-center">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={title.toLowerCase()}
            title={title}
            className="w-full h-full object-contain cursor-pointer aspect-square"
          />
        ) : (
          <FaImage className="w-full md:w-4/5 h-full object-contain cursor-pointer aspect-square text-gray-500 dark:text-gray-300" />
        )}
      </div>
      <div className="flex flex-col w-full h-full px-2 pt-2">
        <h3 className="font-bold line-clamp-2 w-full">
          {title ? (
            title
          ) : (
            <div className="grid gap-2">
              <span className="w-full h-[10px] bg-gray-300 block animate-pulse z-0"></span>
              <span className="w-full h-[10px] bg-gray-300 block animate-pulse z-0"></span>
            </div>
          )}
        </h3>
        <div>
          {/* Stars */}
          <div className="flex items-center my-1">
            <span className="flex text-sm" id="stars">
              <IoMdStar />
              <IoMdStar />
              <IoMdStar />
              <IoIosStarHalf />
              <IoIosStarOutline />
            </span>
            <span className="text-sm" id="reviews">
              ({reviewNo} reviews)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="" id="price">
              ₹{currPrice}
            </span>
          </div>
          <button
            className="text-lg flex items-center justify-center h-[40px] w-full text-center rounded-full border-4 border-red-600 dark:border-red-700 dark:font-bold"
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
    </div>
  );
};

export default Card;
