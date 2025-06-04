import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoIosArrowDown } from "react-icons/io";

import { setSelected } from "../../features/accordionSlice";

// const AccordionContext = createContext();

export default function Accordion({ children, value, onChange, ...props }) {
  // const [selected, setSelected] = useState(value);

  // useEffect(() => {
  //   onChange?.(selected);
  // }, [selected]);

  return (
    <ul {...props}>
      {/* <AccordionContext.Provider value={{ selected, setSelected }}> */}
      {children}
      {/* </AccordionContext.Provider> */}
    </ul>
  );
}

export function AccordionItem({ children, value, title, ...props }) {
  // const { selected, setSelected } = useContext(AccordionContext);
  const selected = useSelector((state) => state.accordion.selected);
  const dispatch = useDispatch();
  let open = selected === value;

  // const ref = useRef(null);

  return (
    <li
      className="border-black dark:border-white border-t-2 rounded-t-lg"
      {...props}
    >
      <header
        role="button"
        onClick={() => dispatch(setSelected(open ? null : value))}
        className={
          !open
            ? "flex justify-between items-center p-4 font-medium border-black dark:border-white border-x-2 rounded-lg"
            : "flex justify-between items-center p-4 font-medium border-black dark:border-white border-x-2 rounded-lg border-b-2"
        }
      >
        {title}
        <IoIosArrowDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </header>
      <div
        className={`overflow-hidden transition-all duration-300 rounded-lg ${
          open ? "max-h-[1000px]" : "max-h-0"
        }`}
      >
        {/* <div className="pt-2 p-4" ref={ref}> */}
        <div className="pt-2 p-4">{children}</div>
      </div>
    </li>
  );
}
