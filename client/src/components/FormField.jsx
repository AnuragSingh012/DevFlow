import React from "react";

const FormField = ({
  labelName,
  type,
  accept,
  name,
  placeholder,
  value,
  handleChange,
  className,
}) => {
  return (
    <>
      {type === "file" ? (
        <div>
          <label className="py-1 font-semibold text-base" htmlFor={name}>{labelName}</label>
          <input
            className={className}
            type={type}
            accept={accept}
            name={name}
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </div>
      ) : type === "textarea" ? (
        <div className="flex flex-col">
          <label className="py-1 font-semibold text-base" htmlFor={name}>{labelName}</label>
          <textarea
            className={className}
            rows={4}
            cols={50}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </div>
      ) : (
        <div className="flex flex-col">
          <label className="py-1 font-semibold text-base" htmlFor={name}>{labelName}</label>
          <input
            className={className}
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </div>
      )}
    </>
  );
};

export default FormField;
