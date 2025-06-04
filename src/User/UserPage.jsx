import { useDispatch } from "react-redux";
import { FaUserAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { changeAuthToken } from "../features/authSlice";

import Cart from "./components/Cart";

const UserPage = () => {
  const base_url = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({});
  const [reviews, setReviews] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useDispatch();

  function getUser() {
    const url = `${base_url}/api/v1/users/me`;
    const data = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.token,
      }),
    });
    data
      .then((dd) => dd.json())
      .then((dd) => {
        // console.log(dd);
        if (dd.status === "error") {
          localStorage.removeItem("token");
          localStorage.removeItem("name");
          dispatch(changeAuthToken(null));
          navigate("/");
        } else {
          localStorage.setItem("name", dd.data.firstname);
          setUser(dd.data);
          const demoCart = {};
          let countPrice = 0;
          dd.data.cart.forEach((item) => {
            if (demoCart[item._id]) {
              demoCart[item._id].count += 1;
            } else {
              demoCart[item._id] = {
                ...item,
                count: 1,
              };
            }
            countPrice += item.currPrice;
          });
          setTotalPrice(countPrice);
          // console.log(demoCart);
          setCart(demoCart);
          setReviews(dd.data.reviews);
          // console.log(dd.data);
        }
      })
      .catch((err) => {
        console.log(err);
        navigate("/");
      });
  }

  function removeCartItem(id) {
    // console.log("Remove Item!!!");
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      setTotalPrice((prevTotalPrice) => prevTotalPrice - newCart[id].currPrice);
      delete newCart[id];
      return { ...newCart };
    });
  }

  useEffect(() => {
    getUser();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    dispatch(changeAuthToken(null));
    navigate("/");
  }

  return (
    <div className="dark:bg-slate-800 dark:text-white flex-1 flex lg:flex-row flex-col justify-center lg:items-center lg:overflow-hidden">
      {/* User Profile */}
      <div className="flex flex-1 flex-col h-full lg:w-fit w-full pt-4 px-4 lg:pb-0 pb-4">
        <div className="w-[100px] h-[100px] px-2 pb-2 mx-2 mb-2 border-2 border-slate-200">
          {user && user.photo != "default-user.jpg" ? (
            <img src={user.photo} alt={user.firstname} />
          ) : (
            <FaUserAlt className="w-full h-full" />
          )}
        </div>
        <div className="ml-2 flex flex-col gap-2">
          <div>
            Name:{" "}
            {user ? (
              <>
                {user.firstname} {user.middlename} {user.lastname}
              </>
            ) : (
              "Loading..."
            )}
          </div>
          <div>Email: {user ? user.email : "Loading..."}</div>
          <div>Role: {user ? user.role : "Loading..."}</div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-400 p-2 rounded-lg self-end tracking-widest text-xl hover:bg-red-500 active:bg-red-700"
        >
          Logout
        </button>
      </div>
      {/* Cart */}
      <Cart
        cart={cart}
        removeCartItem={removeCartItem}
        totalPrice={totalPrice}
        setTotalPrice={setTotalPrice}
      />
      {/* Reviews */}
      <div className="flex flex-1 flex-col h-full min-w-[300px] pt-4 lg:border-t-0 border-t-2 lg:border-l-2 lg:px-4">
        <h1 className="flex text-3xl w-full justify-center items-center font-bold">
          Review
        </h1>
        <div className="flex flex-col flex-1 gap-2 mt-2 items-center w-full">
          {reviews.map((dd) => (
            <div key={dd}>{dd}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
