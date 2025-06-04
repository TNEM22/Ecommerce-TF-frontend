import { ImCross } from "react-icons/im";

import { useDispatch, useSelector } from "react-redux";
import { change } from "../features/modal/filterModalSlice";
import Components from "../SideBar/Components";
import Price from "../SideBar/Price";

const FilterModal = ({ handlePrice }) => {
  const show = useSelector((state) => state.filterModal.value);
  const dispatch = useDispatch();

  return (
    <>
      {show && (
        <div className="fixed top-0 left-0 h-full w-full flex md:hidden dark:text-white z-50">
          <div className="w-[200px] h-full bg-white dark:bg-dark-color pl-5 pr-2 pt-4">
            <div className="flex justify-between mr-3 mb-2 border-b-slate-500 border-b-2">
              <h1 className="text-3xl">Filter</h1>
              <button onClick={() => dispatch(change())}>
                <ImCross />
              </button>
            </div>
            <Components name={"filter-component"} />
            <Price name={"filter-price"} handlePrice={handlePrice} />
          </div>
          <div
            className="flex-1 bg-slate-500 opacity-70"
            onClick={() => dispatch(change())}
          ></div>
        </div>
      )}
    </>
  );
};

export default FilterModal;
