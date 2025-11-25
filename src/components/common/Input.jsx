import React from 'react';

const Input = ({ label, type = 'text', name, value, onChange, placeholder, required = false, icon: Icon }) => {
  return (
    <div className="w-full mb-4">
      {label && <label className="block text-sm font-bold text-slate-600 mb-2 ml-1">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full glass-input rounded-xl py-3 text-slate-800 placeholder-slate-400 ${Icon ? 'pl-11 pr-4' : 'px-4'}`}
        />
      </div>
    </div>
  );
};

export default Input;