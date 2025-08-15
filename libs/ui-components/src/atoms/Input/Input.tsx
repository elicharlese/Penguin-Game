import React from 'react';
import classNames from 'classnames';

interface InputProps {
  type?: 'text' | 'number' | 'email' | 'password';
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  error = false,
  className,
  id,
  name,
}) => {
  const baseClasses = 'block w-full rounded-md border shadow-sm focus:outline-none focus:ring-2';
  
  const stateClasses = error 
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
  
  const disabledClasses = 'bg-gray-100 cursor-not-allowed';
  
  const inputClasses = classNames(
    baseClasses,
    stateClasses,
    disabled && disabledClasses,
    className
  );
  
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={inputClasses}
      id={id}
      name={name}
    />
  );
};

export default Input;
