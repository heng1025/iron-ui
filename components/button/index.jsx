import React from 'react';

const Button = ({ children, ...rest }) => {
  return (
    <button className="iron-btn" type="button" {...rest}>
      {children}
    </button>
  );
};

export default Button;
