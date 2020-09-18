import React, { forwardRef } from 'react';
import classNames from 'classnames';

const Input = forwardRef(({ suffix, ...rest }, ref) => {
  return (
    <div className="iron-input-wrapper">
      <input
        {...rest}
        ref={ref}
        className={classNames('iron-input', suffix ? 'iron-input-icon' : '')}
      />
      {suffix && <span className="iron-input-suffix">{suffix}</span>}
    </div>
  );
});

export default Input;