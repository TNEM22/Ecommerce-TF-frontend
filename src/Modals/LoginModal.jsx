import { useState } from "react";
import { useDispatch } from "react-redux";
import ModalBC from "./component/ModalBC";

import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { changeAuthState } from "../features/modal/authModalSlice";
import { changeAuthToken } from "../features/authSlice";

const LoginModal = () => {
  const base_url = import.meta.env.VITE_SERVER_URL;
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [seePassword, setSeePassword] = useState(false);

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
    if (email.trim() && password.trim()) {
      // console.log("Form submitted!");

      const url = `${base_url}/api/v1/users/login`;
      const data = fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });
      data
        .then((dd) => dd.json())
        .then((dd) => {
          // console.log(dd);
          setNotification(dd.status, dd.message);
          if (dd.status == "success") {
            localStorage.setItem("token", dd.token);
            dispatch(changeAuthToken(dd.token));
            localStorage.setItem("name", dd.data.firstname);
            closeModal();
          }
          setEmail("");
          setPassword("");
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
            <h1 className="mb-4 text-2xl font-bold">Login account</h1>
            <span
              onClick={closeModal}
              className="cursor-pointer px-2 mr-3 rounded-full text-2xl font-bold hover:bg-slate-300 active:bg-slate-400"
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
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              value={email}
              className="mb-2 border-2 border-slate-700 rounded px-2 py-1"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Write your email"
              required
            />
            <label htmlFor="password">Password</label>
            <div className="flex justify-end items-center mb-2">
              <input
                type={seePassword ? "text" : "password"}
                name="password"
                value={password}
                className="border-2 border-slate-700 rounded px-2 py-1 w-full"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
              />
              <div
                onClick={() => setSeePassword(!seePassword)}
                className="absolute mr-4 p-1 cursor-pointer rounded-full hover:bg-slate-200 active:bg-slate-300"
              >
                {seePassword ? <AiFillEye /> : <AiFillEyeInvisible />}
              </div>
            </div>
            <button
              className="self-end px-4 py-2 font-mono font-black text-lg rounded-lg text-white bg-cyan-400 active:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-400/50 active:shadow-sm"
              type="submit"
            >
              Login
            </button>
          </form>
          <div className="flex items-center my-2">
            <span className="flex-1 border-b-2 border-slate-700"></span>
            <span className="">OR</span>
            <span className="flex-1  border-b-2 border-slate-700"></span>
          </div>
          <button
            onClick={() => dispatch(changeAuthState("signup"))}
            className="flex justify-center self-center w-1/2 py-2 bg-lime-500 text-white font-black font-mono text-lg rounded cursor-pointer hover:shadow-lg hover:shadow-lime-500/50 active:shadow-xl active:bg-lime-600"
          >
            SignUp
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
