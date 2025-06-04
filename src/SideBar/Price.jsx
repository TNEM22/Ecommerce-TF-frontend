import RadioInput from "./components/RadioInput";

import { useSelector, useDispatch } from "react-redux";
import { setMinPrice, setMaxPrice } from "../features/filter/filterSlice";
import { useState } from "react";

import "./Price.css";

const Category = ({ name, handlePrice }) => {
  const minVal = useSelector((state) => state.componentValue.minPrice);
  const maxVal = useSelector((state) => state.componentValue.maxPrice);
  const dispatch = useDispatch();
  const items = [
    { value: "all", label: "All" },
    { value: "0-50", label: "₹0-50" },
    { value: "50-500", label: "₹50-500" },
    { value: "500-1000", label: "₹500-1000" },
    { value: "1000-5000", label: "₹1000-5000" },
    { value: "5000-?", label: "Over ₹5000" },
  ];
  return (
    <>
      <div className="flex justify-start w-full flex-col mb-4">
        <h2 className="font-thin text-2xl mb-2">Price</h2>
        <div>
          {/* {items.map((item) => (
            <RadioInput
              key={item.value + 1 + item.label}
              name={name}
              value={item.value}
              text={item.label}
              checked={value === item.value}
              onChangeHandler={(e) => dispatch(setPrice(e.target.value))}
            />
          ))} */}
          <div>
            ₹{minVal}-₹{maxVal}
            {maxVal == 5000 ? "+" : ""}
          </div>
          <div className="relative h-2 w-full bg-gray-500 rounded my-2">
            <div
              className="absolute h-2 bg-teal-500 rounded"
              style={{
                left: `${(minVal / 5000) * 100}%`,
                right: `${100 - (maxVal / 5000) * 100}%`,
              }}
            />
            <input
              type="range"
              name="price"
              min={0}
              max={5000}
              step="50"
              value={minVal}
              onChange={(e) => {
                if (Number(e.target.value) + 200 < Number(maxVal))
                  dispatch(setMinPrice(e.target.value));
              }}
              className="absolute w-full h-2 bg-transparent pointer-events-none appearance-none"
              style={{ zIndex: 3 }}
            />
            <input
              type="range"
              name="price"
              min={0}
              max={5000}
              value={maxVal}
              onChange={(e) => {
                if (Number(e.target.value) > Number(minVal) + 200)
                  dispatch(setMaxPrice(e.target.value));
              }}
              step="50"
              className="absolute w-full h-2 bg-transparent pointer-events-none appearance-none"
              style={{ zIndex: 2 }}
            />
          </div>
          <button
            onClick={handlePrice}
            className="px-2 border-gray-700 border-2 rounded-full active:border-teal-800 active:bg-teal-100"
          >
            Go
          </button>
        </div>
      </div>
    </>
  );
};

export default Category;
