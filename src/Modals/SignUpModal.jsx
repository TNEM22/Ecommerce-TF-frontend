import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import ModalBC from "./component/ModalBC";

import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { changeAuthState } from "../features/modal/authModalSlice";
import { changeAuthToken } from "../features/authSlice";

const SignUpModal = () => {
  const base_url = import.meta.env.VITE_SERVER_URL;
  const dispatch = useDispatch();

  const [checkOTP, setCheckOTP] = useState(false);
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [seePasswordConfirm, setSeePasswordConfirm] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otp3, setOtp3] = useState("");
  const [otp4, setOtp4] = useState("");
  const [otp5, setOtp5] = useState("");
  const [otp6, setOtp6] = useState("");

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
    const otp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;
    setIsSubmitting(true);
    if (
      otp.trim() &&
      email.trim() &&
      firstname.trim() &&
      middlename.trim() &&
      lastname.trim() &&
      password.trim() &&
      passwordConfirm.trim()
    ) {
      // console.log("Form submitted!");
      // console.log("Form Submitted!!");
      const url = `${base_url}/api/v1/users/signup`;
      const data = fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: otp.trim(),
          email: email.trim(),
          firstname: firstname.trim(),
          middlename: middlename.trim(),
          lastname: lastname.trim(),
          password: password.trim(),
          passwordConfirm: passwordConfirm.trim(),
        }),
      });
      data
        .then((dd) => dd.json())
        .then((dd) => {
          // console.log(dd);
          setNotification(dd.status, dd.message);
          if (dd.status == "success") {
            // setFirstname("");
            // setMiddlename("");
            // setLastname("");
            // setEmail("");
            setPassword("");
            setPasswordConfirm("");
            localStorage.setItem("token", dd.token);
            dispatch(changeAuthToken(dd.token));
            localStorage.setItem("name", dd.data.firstname);
            dispatch(changeAuthState(null)); // Close Modal
            // dispatch(changeAuthState("login"));
          } else {
            setOtpVerified(false);
            setOtp1("");
            setOtp2("");
            setOtp3("");
            setOtp4("");
            setOtp5("");
            setOtp6("");
            setFirstname("");
            setMiddlename("");
            setLastname("");
            setEmail("");
            setPassword("");
            setPasswordConfirm("");
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setTimeout(() => setIsSubmitting(false), 300));
    } else if (email.trim() && otp.trim()) {
      // Check OTPs
      // console.log("CHECK OTP");
      const url = `${base_url}/api/v1/users/signup/otp`;
      const data = fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
        }),
      });
      data
        .then((dd) => dd.json())
        .then((dd) => {
          // console.log(dd);
          setNotification(dd.status, dd.message);
          if (dd.status == "success") {
            setCheckOTP(false);
            setOtpVerified(true);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setTimeout(() => setIsSubmitting(false), 300));
    } else if (email.trim()) {
      // Get OTP
      // console.log("GET OTP");
      const url = `${base_url}/api/v1/users/signup`;
      const data = fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });
      let statusCode = null;
      data
        .then((dd) => {
          // console.log(dd.url);
          statusCode = dd.status;
          return dd.json();
        })
        .then((dd) => {
          // console.log(dd);
          setNotification(dd.status, dd.message);
          if (statusCode == 409) {
            setTimeout(() => {
              dispatch(changeAuthState("login"));
            }, 2000);
          }
          if (dd.status == "success") {
            setCheckOTP(true);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setTimeout(() => setIsSubmitting(false), 300));
    }
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Allow only digits

    const newOtp = [otp1, otp2, otp3, otp4, otp5, otp6];
    newOtp[index] = value;

    setOtp1(newOtp[0]);
    setOtp2(newOtp[1]);
    setOtp3(newOtp[2]);
    setOtp4(newOtp[3]);
    setOtp5(newOtp[4]);
    setOtp6(newOtp[5]);

    if (value && index < 5) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleBackspace = (index, e) => {
    if (
      e.key === "Backspace" &&
      ![otp1, otp2, otp3, otp4, otp5, otp6][index] &&
      index > 0
    ) {
      otpRefs[index - 1].current.focus();
    }
  };

  return (
    <>
      <ModalBC />
      <div className="fixed h-full w-full top-0 left-0 flex justify-center items-center z-20 select-none">
        <div className="bg-white p-4 flex flex-col rounded w-3/4 max-w-[500px]">
          <div className="flex items-center mb-4 justify-between">
            <h1 className="text-2xl font-bold">Create an account</h1>
            <span
              onClick={() => dispatch(changeAuthState(null))}
              className="text-center cursor-pointer px-2 mr-3 rounded-full text-2xl font-bold hover:bg-slate-300 active:bg-slate-400"
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
              type="email"
              name="email"
              value={email}
              className={
                !otpVerified
                  ? "mb-2 border-2 border-slate-700 rounded px-2 py-1"
                  : "mb-2 border-2 border-slate-700 bg-slate-300 text-slate-600 pointer-events-none cursor-none rounded px-2 py-1 font-bold"
              }
              onChange={(e) => {
                !otpVerified ? setEmail(e.target.value) : e.preventDefault();
              }}
              placeholder="Write your email"
              required
            />
            {checkOTP && (
              <>
                <label htmlFor="otp">OTP</label>
                <div className="flex gap-2 mb-2">
                  {[otp1, otp2, otp3, otp4, otp5, otp6].map((otpVal, index) => (
                    <input
                      key={index}
                      ref={otpRefs[index]}
                      type="text"
                      className="border-2 border-slate-700 rounded px-2 py-1 w-8 text-xl text-center"
                      value={otpVal}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleBackspace(index, e)}
                      maxLength={1}
                      required
                    />
                  ))}
                </div>
              </>
            )}
            {otpVerified && (
              <>
                <label htmlFor="firstname">First name</label>
                <input
                  type="text"
                  name="firstname"
                  value={firstname}
                  className="mb-2 border-2 border-slate-700 rounded px-2 py-1"
                  onChange={(e) => setFirstname(e.target.value)}
                  placeholder="Write your firstname"
                />
                <label htmlFor="middlename">Middle name</label>
                <input
                  type="text"
                  name="middlename"
                  value={middlename}
                  className="mb-2 border-2 border-slate-700 rounded px-2 py-1"
                  onChange={(e) => setMiddlename(e.target.value)}
                  placeholder="Write your middlename"
                />
                <label htmlFor="lastname">Last name</label>
                <input
                  type="text"
                  name="lastname"
                  value={lastname}
                  className="mb-2 border-2 border-slate-700 rounded px-2 py-1"
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Write your lastname"
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
                  />
                  <div
                    onClick={() => setSeePassword(!seePassword)}
                    className="absolute mr-4 p-1 cursor-pointer rounded-full hover:bg-slate-200 active:bg-slate-300"
                  >
                    {seePassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                  </div>
                </div>
                <label htmlFor="passwordConfirm">Confirm Password</label>
                <div className="flex justify-end items-center mb-2">
                  <input
                    type={seePasswordConfirm ? "text" : "password"}
                    name="passwordConfirm"
                    value={passwordConfirm}
                    className="border-2 border-slate-700 rounded px-2 py-1 w-full"
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Your confirm password"
                  />
                  <div
                    onClick={() => setSeePasswordConfirm(!seePasswordConfirm)}
                    className="absolute mr-4 p-1 cursor-pointer rounded-full hover:bg-slate-200 active:bg-slate-300"
                  >
                    {seePasswordConfirm ? (
                      <AiFillEye />
                    ) : (
                      <AiFillEyeInvisible />
                    )}
                  </div>
                </div>
              </>
            )}
            <button
              className="self-end flex justify-center items-center px-4 py-2 font-mono font-black text-lg rounded-lg text-white bg-lime-400 active:bg-lime-500 hover:shadow-lg hover:shadow-lime-400/50 active:shadow-sm"
              type="submit"
            >
              {isSubmitting && (
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
              )}
              SignUp
            </button>
          </form>
          <div className="flex items-center my-2">
            <span className="flex-1 border-b-2 border-slate-700"></span>
            <span className="">OR</span>
            <span className="flex-1  border-b-2 border-slate-700"></span>
          </div>
          <button
            onClick={() => dispatch(changeAuthState("login"))}
            className="flex justify-center self-center w-1/2 py-2 bg-cyan-500 text-white font-black font-mono text-lg rounded cursor-pointer hover:shadow-lg hover:shadow-cyan-500/50 active:shadow-xl active:bg-cyan-600"
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
};

export default SignUpModal;
