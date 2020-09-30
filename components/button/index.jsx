import React from 'react';
import classNames from 'classnames';

const Button = ({ children, className: cls, ...rest }) => {
  return (
    <button className={classNames(cls, 'iron-btn')} type="button" {...rest}>
      {children}
    </button>
  );
};

Button.displayName = 'Button';
export default Button;
