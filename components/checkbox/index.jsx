import React, { forwardRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import Icon from 'antd/es/icon';

const Checkbox = forwardRef((props, ref) => {
  const { children, checked, indeterminate, onChange, ...rest } = props;
  const [isChecked, setChecked] = useState(false);
  const [val, setVal] = useState('');

  useEffect(() => {
    setChecked(checked);
  }, [checked]);

  function getCheckIcon() {
    if (isChecked) {
      return <Icon type="check" className="iron-checkbox-checked-icon" />;
    }
    if (indeterminate) {
      return <em className="iron-checkbox-indeterminate" />;
    }
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="iron-checkbox-wrapper"
      onClick={(e) => {
        e.stopPropagation();
        setChecked(!isChecked);
      }}
    >
      <input
        {...rest}
        type="checkbox"
        ref={ref}
        className={classNames(
          'iron-checkbox-input',
          children ? 'iron-checkbox-has-children' : ''
        )}
        checked={isChecked}
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
          if (onChange) {
            onChange(e);
          }
        }}
      />
      <span
        className={classNames(
          'iron-checkbox-square',
          isChecked ? 'iron-checkbox-checked' : ''
        )}
      >
        {getCheckIcon()}
      </span>
      {children && <span className="iron-checkbox-label">{children}</span>}
    </div>
  );
});

export default Checkbox;
