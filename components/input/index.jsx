import React, { forwardRef } from 'react';
import classNames from 'classnames';

const Input = forwardRef(({ suffix, className, ...rest }, ref) => {
  return (
    <div className={classNames('iron-input-wrapper', className)}>
      <input
        {...rest}
        ref={ref}
        className={classNames('iron-input', { 'iron-input-icon': suffix })}
      />
      {suffix && <span className="iron-input-suffix">{suffix}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
