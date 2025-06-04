import { IoMdStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  increment,
  decrement,
} from "../../features/counter/cartItemsCounterSlice";
import { changeAuthState } from "../../features/modal/authModalSlice";
import { useState } from "react";

const Card = ({ id, imgSrc, title, reviewNo, defaultPrice, currPrice }) => {
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
        productId: id,
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
        productId: id,
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

  return (
    <div className="w-full md:max-h-[350px] border-slate-100 md:border-transparent hover:border-slate-300 border-2 flex md:flex-col hover:shadow-md items-center">
      <Link
        to={{ pathname: `/product/${id}` }}
        className="md:w-full md:h-[170px] h-full border-b-slate-100 md:border-b-2 border-r-2 md:border-r-0 basis-full flex items-center justify-center"
      >
        <img
          src={imgSrc}
          alt={title.toLowerCase()}
          title={title}
          className="w-full md:w-4/5 h-full object-contain cursor-pointer aspect-square"
        />
      </Link>
      <div className="flex flex-col w-full h-full">
        <Link
          to={{ pathname: `/product/${id}` }}
          className="px-2 pt-2 flex flex-col flex-1 h-full w-full cursor-pointer"
        >
          <h3 className="font-bold line-clamp-2">{title}</h3>
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
                ₹<span className="line-through">{defaultPrice}</span>
                {currPrice}
              </span>
            </div>
          </div>
        </Link>
        <button
          className={
            !count
              ? "text-lg flex items-center justify-center h-[40px] w-full text-center rounded-full bg-yellow-300 hover:bg-yellow-400 active:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:active:bg-yellow-500 border-4 border-white dark:border-slate-800 dark:font-bold"
              : "text-lg flex items-center justify-center h-[40px] w-full text-center rounded-full border-4 border-yellow-300 dark:border-yellow-600 dark:font-bold"
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
  );
};

export default Card;
