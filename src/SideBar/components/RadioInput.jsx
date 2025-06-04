const RadioInput = ({ value, name, text, checked, onChangeHandler }) => {
  return (
    <div className="w-full">
      <label className="flex items-center font-medium text-gray-900 w-full dark:text-white">
        <input
          type="radio"
          value={value}
          name={name}
          checked={checked}
          onChange={onChangeHandler}
          className="w-4 h-4"
        />
        <span className="ml-2"></span>
        {text}
      </label>
    </div>
  );
};

export default RadioInput;
