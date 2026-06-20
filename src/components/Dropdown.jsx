import React from "react";
import "../styles/FormElements.css";

function Dropdown({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  required = false,
  name,
  error,
}) {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <select
        value={value}
        onChange={onChange}
        required={required}
        name={name}
        className={error ? "input-error" : ""}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

export default Dropdown;
