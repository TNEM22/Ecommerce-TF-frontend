import { useNavigate } from "react-router-dom";
import { MdOutlineShoppingCart } from "react-icons/md";

import Card from "./Card";

const Cart = ({ cart, removeCartItem, totalPrice, setTotalPrice }) => {
  const navigate = useNavigate();

  const handleBuyButton = () => {
    navigate("/checkout");
  };

  return (
    <div className="flex flex-1 flex-col h-full min-w-[300px] pt-4 pb-4 lg:border-t-0 border-t-2 lg:border-l-2 lg:px-4 lg:overflow-auto">
      <h1 className="flex text-3xl w-full justify-center items-center font-bold">
        Cart&nbsp;&nbsp;
        <MdOutlineShoppingCart className="text-4xl" />
      </h1>
      <button
        className="text-lg flex items-center justify-center h-[40px] w-full text-center rounded-full bg-yellow-300 hover:bg-yellow-400 active:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:active:bg-yellow-500 border-4 border-white dark:border-slate-800 dark:font-bold"
        id="add2cart"
        onClick={handleBuyButton}
      >
        Proceed to Pay ₹{totalPrice}
      </button>
      <div className="flex flex-col flex-1 gap-2 my-2 items-center w-full">
        {Object.keys(cart).length ? (
          Object.keys(cart).map((dd) => (
            <div key={dd}>
              <Card
                product={cart[dd]}
                removeCartItem={removeCartItem}
                setTotalPrice={setTotalPrice}
              />
            </div>
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
        onClick={handleBuyButton}
      >
        Proceed to Pay ₹{totalPrice}
      </button>
    </div>
  );
};

export default Cart;
