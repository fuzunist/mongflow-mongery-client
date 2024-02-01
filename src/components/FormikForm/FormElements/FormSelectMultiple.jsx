import React from "react";
import Select from "react-select";

export const FormSelectMultiple = ({
  placeholder,
  name,
  options,
  value,
  isMulti,
  label,
  onChange,
  classname,
}) => {
  const onChanges = (option) => {
    onChange({
      target: {
        name,
        value: isMulti ? option?.map((item) => item.value) : option.value,
      },
    });
  };

  const getValue = () => {
    if (options) {
      return isMulti
        ? options.filter((option) => value.indexOf(option.value) >= 0)
        : options.find((option) => option.value === value);
    } else {
      return isMulti ? [] : "";
    }
  };

  return (
    <Select
      className={classname+ " mt-2"}
      name={name}
      value={getValue()}
      onChange={onChanges}
      placeholder={placeholder}
      options={options}
      isMulti={isMulti}
      _label={label}
      label={label}
    />
  );
};

export default FormSelectMultiple;
