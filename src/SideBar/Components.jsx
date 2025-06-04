import RadioInput from "./components/RadioInput";

import { useSelector, useDispatch } from "react-redux";
import { setComponent } from "../features/filter/filterSlice";

const Components = ({ name }) => {
  const value = useSelector((state) => state.componentValue.component);
  const dispatch = useDispatch();
  const items = [
    { value: "all", label: "All" },
    { value: "passive", label: "Passive" },
    { value: "active", label: "Active" },
    { value: "electromechanical", label: "Electromechanical" },
    { value: "power", label: "Power" },
    { value: "sensors", label: "Sensors" },
    { value: "leds", label: "LEDs" },
  ];
  return (
    <>
      <div className="flex justify-start w-full flex-col mb-4">
        <h2 className="font-thin text-2xl mb-2">Components</h2>
        <div>
          {items.map((item) => (
            <RadioInput
              key={item.value + 1}
              name={name}
              value={item.value}
              text={item.label}
              checked={value === item.value}
              onChangeHandler={(e) => dispatch(setComponent(e.target.value))}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Components;
