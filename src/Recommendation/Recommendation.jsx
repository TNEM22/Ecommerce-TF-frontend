import { useSelector, useDispatch } from "react-redux";
import { setBrand } from "../features/filter/filterSlice";

const Recommendation = () => {
  const value = useSelector((state) => state.componentValue.brand);
  const dispatch = useDispatch();
  const items = [
    { value: "all", label: "All Brands" },
    { value: "arduino", label: "Arduino" },
    { value: "raspberrypi", label: "Raspberry Pi" },
    { value: "beaglebone", label: "Beagle Bone" },
    { value: "esps", label: "Esps" },
    { value: "nvidia", label: "Nvidia" },
  ];
  return (
    <>
      <div className="mb-3">
        <div>
          <h2 className="font-bold text-xl">Recommended</h2>
          <div className="flex flex-wrap">
            {items.map((item) => (
              <Button
                key={item.value + item.label}
                selected={value == item.value}
                value={item.value}
                label={item.label}
                onClickHandler={(e) => {
                  dispatch(setBrand(e.target.value));
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const Button = ({ selected, value, label, onClickHandler }) => {
  return (
    <button
      value={value}
      className={
        selected
          ? "px-4 py-1 mr-1 mt-3 border-slate-200 border-2 text-sm text-black dark:text-white font-bold font-middle rounded-lg bg-slate-300 dark:bg-slate-600"
          : "px-4 py-1 mr-1 mt-3 border-slate-200 border-2 text-sm text-slate-600 dark:text-slate-200 font-middle rounded-lg active:bg-slate-300 dark:active:bg-slate-600"
      }
      onClick={onClickHandler}
    >
      {label}
    </button>
  );
};

export default Recommendation;
