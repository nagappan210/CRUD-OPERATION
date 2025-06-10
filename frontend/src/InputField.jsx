import React from "react";

const InputField = ({ Icon, type, value, onChange, placeholder }) => {
  return (
    <div className="relative mb-4">
     
      <Icon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
      
      
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-10 w-full border rounded-xl px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
    </div>
  );
};

export default InputField;
   