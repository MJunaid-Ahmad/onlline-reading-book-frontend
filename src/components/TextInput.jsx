import React from "react";
import "../styles/FormElements.css";

function TextInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  name,
  error,
}) {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        name={name}
        className={error ? "input-error" : ""}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

export default TextInput;
