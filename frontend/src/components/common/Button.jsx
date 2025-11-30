import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'px-6 py-2 rounded-lg font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    danger: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-md',
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

