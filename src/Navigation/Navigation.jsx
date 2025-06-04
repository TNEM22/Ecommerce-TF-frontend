import { BsSearch } from "react-icons/bs";
import { MdOutlineShoppingCart, MdDarkMode, MdLightMode } from "react-icons/md";
import { GoPersonAdd } from "react-icons/go";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosArrowDown } from "react-icons/io";
// import FilterModal from "../Modals/FilterModal";

import SignUpModal from "../Modals/SignUpModal";
import LoginModal from "../Modals/LoginModal";
import AddressFormModal from "../Modals/AddressFormModal";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { change } from "../features/modal/filterModalSlice";

import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { changeAuthState } from "../features/modal/authModalSlice";
import { changeAuthToken } from "../features/authSlice";
import { setCartItemsCount } from "../features/counter/cartItemsCounterSlice";

const Navigation = () => {
  const base_url = import.meta.env.VITE_SERVER_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cartItemsCounter.value);
  const authState = useSelector((state) => state.authModal.authState);
  const token = useSelector((state) => state.auth.token);
  useEffect(() => {
    const token = localStorage.token;
    if (!token || token == "undefined" || token == "null") {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      return;
    }
    dispatch(changeAuthToken(localStorage.token));
    const url = `${base_url}/api/v1/users/cart`;
    const data = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    data
      .then((dd) => dd.json())
      .then((dd) => dispatch(setCartItemsCount(dd.data)));
  }, []);

  const [colorTheme, setTheme] = useState(localStorage.theme);
  useEffect(() => {
    const root = window.document.documentElement;
    root.className = colorTheme + " h-full";
    localStorage.setItem("theme", colorTheme);
  }, [colorTheme]);

  const toggleDarkMode = () => {
    if (colorTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  function handleCartClick() {
    if (!localStorage.token) {
      dispatch(changeAuthState("login"));
      return;
    }
    navigate("/user");
  }

  return (
    <>
      {authState != null ? (
        authState == "signup" ? (
          <SignUpModal />
        ) : authState == "login" ? (
          <LoginModal />
        ) : authState == "addressform" ? (
          <AddressFormModal />
        ) : null
      ) : (
        ""
      )}
      <nav className="h-auto border-slate-200 border-b-2 md:sticky top-0 bg-white w-full py-2 z-10 dark:bg-dark-color dark:text-white">
        {token && (
          <div className="flex justify-end items-center pb-1 px-3">
            <span className="flex cursor-pointer items-center hover:underline underline-offset-3">
              Track&nbsp;your&nbsp;order
            </span>
            &nbsp;|&nbsp;
            <Link
              to="/user"
              className="flex cursor-pointer items-center hover:underline underline-offset-3"
            >
              Welcome&nbsp;{localStorage.name}
              {/* <IoIosArrowDown className="ml-1" /> */}
            </Link>
          </div>
        )}
        <div className="flex justify-between items-center">
          {/* <FilterModal /> */}
          <button
            className="mr-2 ml-4 md:hidden"
            onClick={() => dispatch(change())}
          >
            <GiHamburgerMenu />
          </button>
          <Link to="/">
            <img
              src={
                base_url +
                (colorTheme === "light"
                  ? `/imgs/white-logo.png`
                  : `/imgs/dark-logo.png`)
              }
              alt="TeamFortrans Electronics"
              className="h-[50px] md:ml-4"
            />
          </Link>
          <div className="flex justify-center items-center">
            <div className="sm:flex items-center hidden ">
              <input
                type="text"
                className="bg-slate-100 p-1 rounded-md border-slate-200 border-2 text-lg text-slate-600 w-4/5 md:w-fit h-fit"
                name="search"
                id="search"
                placeholder="Search...."
              />
              <button className="flex justify-center items-center ml-2 w-12 h-12 text-xl active:bg-slate-300 border-2 border-transparent hover:border-slate-300 rounded-full">
                <BsSearch />
              </button>
            </div>
          </div>
          <div className="flex">
            <button
              onClick={toggleDarkMode}
              className="mr-2 text-2xl active:bg-slate-300 rounded-full"
            >
              {colorTheme === "dark" ? <MdLightMode /> : <MdDarkMode />}
            </button>
            <button
              onClick={handleCartClick}
              className="flex justify-center items-center w-fit px-1 rounded-full text-3xl my-2 border-2 border-transparent active:border-slate-300"
            >
              <MdOutlineShoppingCart />
              <p className="text-base text-slate-800 font-black bg-orange-400 rounded-full w-fit self-end px-1">
                {cartItems}
              </p>
            </button>
            {!token && (
              <button
                onClick={() => dispatch(changeAuthState("login"))}
                className="flex justify-center items-center w-12 rounded-full text-3xl my-2 border-2 border-transparent active:border-slate-300"
              >
                <GoPersonAdd />
              </button>
            )}
          </div>
        </div>
        <div className="px-3 mt-2 flex sm:hidden w-full justify-around">
          <input
            type="text"
            className="bg-slate-100 p-1 rounded-md border-slate-200 border-2 text-lg text-slate-600 w-4/5 md:w-fit h-fit"
            name="search"
            id="search"
            placeholder="Search...."
          />
          <button className="flex justify-center items-center ml-2 w-12 h-12 text-xl active:bg-slate-300 border-2 border-transparent hover:border-slate-300 rounded-full">
            <BsSearch />
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
