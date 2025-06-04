import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import ModalBC from "./component/ModalBC";
import { changeAuthState } from "../features/modal/authModalSlice";
import { changeAuthToken } from "../features/authSlice";

const AddressFormModal = () => {
  const base_url = import.meta.env.VITE_SERVER_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function closeModal() {
    dispatch(changeAuthState(null));
  }

  function notifyError(msg) {
    let timerId;
    return function () {
      clearTimeout(timerId);
      setErrorMessage(msg);
      timerId = setTimeout(() => setErrorMessage(""), 5000);
    };
  }

  function notifySuccess(msg) {
    let timerId;
    return function () {
      clearTimeout(timerId);
      setSuccessMessage(msg);
      timerId = setTimeout(() => setSuccessMessage(""), 5000);
    };
  }

  function setNotification(type, msg) {
    let fn = null;
    if (type == "error") {
      fn = notifyError(msg);
    } else {
      fn = notifySuccess(msg);
    }
    fn();
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (number.trim() && address.trim()) {
      const url = `${base_url}/api/v1/users/update`;
      const data = fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.token,
          number: number,
          address: address,
        }),
      });
      data
        .then((dd) => dd.json())
        .then((dd) => {
          // console.log(dd);
          setNotification(dd.status, dd.message);
          if (dd.status == "success") {
            // console.log(dd);
            setNumber("");
            setAddress("");
            setTimeout(() => {
              closeModal();
              navigate("/checkout");
              window.location.reload();
            }, 300);
          }
        })
        .catch((err) => console.error(err));
    }
  }
  return (
    <>
      <ModalBC />
      <div className="fixed h-full w-full top-0 left-0 flex justify-center items-center z-20 select-none">
        <div className="bg-white p-4 flex flex-col rounded w-3/4 max-w-[500px]">
          <div className="flex items-center mb-4 justify-between">
            <h1 className="text-2xl font-bold flex">Add New Address</h1>
            <span
              onClick={closeModal}
              className="cursor-pointer px-2 rounded-full text-2xl font-bold hover:bg-slate-300 active:bg-slate-400"
            >
              X
            </span>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="w-full text-lg text-red-500 font-black text-center">
              {errorMessage}
            </div>
            <div className="w-full text-lg text-green-500 font-black text-center">
              {successMessage}
            </div>
            <label htmlFor="number">Mobile Number</label>
            <input
              type="text"
              name="number"
              value={number}
              className="mb-2 border-2 border-slate-700 rounded px-2 py-1"
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Enter your mobile number"
              maxLength="10"
              required
            />
            <label htmlFor="address">Address with pincode</label>
            <textarea
              rows="5"
              name="address"
              value={address}
              className="mb-2 border-2 border-slate-700 rounded px-2 py-1"
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address with pincode"
              required
            ></textarea>
            <button
              className="self-end px-4 py-2 font-mono font-black text-lg rounded-lg text-white bg-cyan-400 active:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-400/50 active:shadow-sm"
              type="submit"
            >
              Add Address
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddressFormModal;
