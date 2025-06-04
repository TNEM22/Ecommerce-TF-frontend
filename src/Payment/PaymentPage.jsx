import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GridLoader } from "react-spinners";

import { changeAuthToken } from "../features/authSlice";

import Accordion, { AccordionItem } from "./components/Accordion";
import { changeAuthState } from "../features/modal/authModalSlice";
import { setSelected } from "../features/accordionSlice";
import Card from "./components/Card";

const PaymentPage = () => {
  const base_url = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState({});
  const [cart, setCart] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [address, setAddress] = useState("");
  const [cartIds, setCartIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!localStorage.token) navigate("/");
    getUser();
  }, []);

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
          setUser(dd.data);
          const demoCart = {};
          let countPrice = 0;
          const newCartIds = [];

          dd.data.cart.forEach((item) => {
            newCartIds.push(item._id);
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
          setCartIds(newCartIds);
          setTotalPrice(countPrice);
          // console.log(demoCart);
          setCart(demoCart);
          // console.log(dd.data);
        }
      })
      .catch((err) => {
        console.log(err);
        navigate("/");
      });
  }

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");

      script.src = src;

      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const createRazorpayOrder = (amount) => {
    const url = `${base_url}/api/v1/orders/create`;
    const res = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.token,
        amount: amount * 100,
        currency: "INR",
        cart: cartIds,
        address: address,
      }),
    });
    res
      .then((dd) => dd.json())
      .then((dd) => {
        // console.log(dd);
        if (dd.status == "success")
          handleRazorpayScreen(dd.data.order_id, dd.data.amount);
        else alert("Error with cart items!");
      })
      .catch((err) => console.log(err));
  };

  const handleRazorpayScreen = async (order_id, amount) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res || !address) {
      alert("Razorpay not working!");
      return;
    }

    const options = {
      key: "rzp_test_xT88zV9NnrFf1l",
      amount: amount,
      order_id: order_id,
      currency: "INR",
      name: "TeamFortrans Electronics",
      description: "Paying to TeamFortrans",
      image:
        "https://res.cloudinary.com/dgcedlhpl/image/upload/v1742489604/white-logo_dmtnfb.png",
      handler: function (rsp) {
        const paymentData = {
          razorpay_order_id: rsp.razorpay_order_id,
          razorpay_payment_id: rsp.razorpay_payment_id,
          razorpay_signature: rsp.razorpay_signature,
        };
        verifyPayment(paymentData);
      },
      prefill: {
        name: "TeamFortrans",
        email: "teamfortrans@gmail.com",
      },
      theme: {
        color: "#181818",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const verifyPayment = (paymentData) => {
    setIsSubmitting(true);
    const url = `${base_url}/api/v1/orders/verify`;
    const res = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.token,
        ...paymentData,
      }),
    });
    res
      .then((dd) => dd.json())
      .then((dd) => {
        console.log(dd);
        alert("Payment Success!!");
        setIsSubmitting(false);
        navigate("/");
        setTimeout(() => window.location.reload(), 300);
      })
      .catch((err) => console.log(err));
  };

  const handlePaymentButton = () => {
    if (!address) return dispatch(setSelected("1"));
    createRazorpayOrder(totalPrice + 40);
  };

  return (
    <>
      {isSubmitting && (
        <>
          <div className="fixed h-full w-full z-40 bg-slate-800 opacity-70"></div>
          <div className="fixed h-full w-full z-50 flex justify-center items-center">
            <GridLoader
              color="#ffffff"
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        </>
      )}
      <div className="dark:bg-slate-800 dark:text-white py-4 flex flex-1 flex-col items-center w-full">
        <Accordion value="1" className="max-w-lg h-fit">
          <div className="mb-4">
            <div className="text-xl font-bold">Selected Address</div>
            <div>
              {address ? (
                <div className="hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer p-2 border-b border-t border-black dark:border-white rounded-lg select-none">
                  <div>Phone no. {address.phoneno}</div>
                  <div>Address:</div>
                  <div>{address.address}</div>
                </div>
              ) : (
                <div className="flex w-full justify-center font-bold [text-shadow:_0_4px_4px_rgb(99_102_241_/_0.8)] text-xl">
                  No address selected.
                </div>
              )}
            </div>
          </div>
          <AccordionItem value="1" title="Select Your Address">
            <button
              onClick={() => dispatch(changeAuthState("addressform"))}
              className="px-4 py-2 w-full font-mono font-black text-lg rounded-lg text-black bg-yellow-400 active:bg-yellow-500 hover:shadow-lg hover:shadow-yellow-400/50 active:shadow-sm"
            >
              Add Address
            </button>
            <div className="w-full">
              <h1 className="font-black text-xl">Select Address</h1>
              <ul className="w-full border-2 rounded-lg border-black dark:border-white">
                {user.addresses?.length &&
                  user.addresses.map((item) => (
                    <li
                      key={item.phoneno + item.address}
                      onClick={() => {
                        setAddress(item);
                        dispatch(setSelected("2"));
                      }}
                      className="hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer p-2 border-b rounded-lg border-black dark:border-white select-none"
                    >
                      <div>Phone no. {item.phoneno}</div>
                      <div>Address:</div>
                      <div>{item.address}</div>
                    </li>
                  ))}
              </ul>
            </div>
          </AccordionItem>
          <AccordionItem value="2" title="Billing">
            <button
              className="text-lg flex items-center justify-center h-[40px] w-full text-center rounded-full bg-yellow-300 hover:bg-yellow-400 active:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:active:bg-yellow-500 border-4 border-white dark:border-slate-800 dark:font-bold"
              id="add2cart"
              onClick={handlePaymentButton}
            >
              Confirm Order
            </button>
            <div className="flex flex-col border-b-2 py-2 text-xl border-black dark:border-white">
              <div className="w-full flex justify-between">
                Items: <span>₹{totalPrice}.00</span>
              </div>
              <div className="w-full flex justify-between">
                Delivery: <span>₹40.00</span>
              </div>
              <div className="w-full flex justify-between font-bold">
                Order Total: <span>₹{totalPrice + 40}.00</span>
              </div>
            </div>
            <div className="flex flex-wrap flex-row flex-1 gap-2 my-2 items-center w-full">
              {Object.keys(cart).length ? (
                Object.keys(cart).map((dd) => (
                  <Card key={dd} product={cart[dd]} />
                ))
              ) : (
                <div className="flex w-full justify-center font-bold [text-shadow:_0_4px_4px_rgb(99_102_241_/_0.8)] text-xl">
                  Your Cart is Empty.
                </div>
              )}
            </div>
            <button
              className="text-lg flex items-center justify-center h-[40px] w-full text-center rounded-full bg-yellow-300 hover:bg-yellow-400 active:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:active:bg-yellow-500 border-4 border-white dark:border-slate-800 dark:font-bold"
              id="add2cart"
              onClick={handlePaymentButton}
            >
              Confirm Order
            </button>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default PaymentPage;
