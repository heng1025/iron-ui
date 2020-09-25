import React, { forwardRef, useEffect, useState } from 'react';
import classNames from 'classnames';
// import Icon from '../icon';

const Radio = forwardRef((props, ref) => {
  const {
    children,
    disabled,
    checked,
    defaultChecked,
    value,
    onChange,
    className,
    ...rest
  } = props;
  const [isChecked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(checked);
  }, [checked]);

  return (
    <label
      htmlFor="iron-radio"
      className={classNames(
        className,
        'iron-radio-wrapper',
        disabled ? 'iron-checkbox-wrapper-disabled' : ''
      )}
    >
      <span
        className={classNames(
          'iron-radio',
          disabled ? 'iron-radio-disabled' : ''
        )}
      >
        <input
          ref={ref}
          type="radio"
          id="iron-radio"
          name="iron-raido"
          value={value}
          {...rest}
          className={classNames(
            'iron-radio-input',
            disabled ? 'iron-radio-input-disabled' : ''
          )}
          disabled={disabled}
          defaultChecked={defaultChecked}
          // expect boolean
          checked={!!isChecked}
          onChange={e => {
            setChecked(e.target.checked);
            if (onChange) {
              onChange(e);
            }
          }}
        />
      </span>
      {children && <span className="iron-radio-label">{children}</span>}
    </label>
  );
});

export default Radio;
