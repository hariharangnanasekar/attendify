import React from 'react';

const Card = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`card ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </div>
  );
};

export default Card;

