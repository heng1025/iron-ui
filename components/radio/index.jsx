import React, { forwardRef, useEffect, useState } from 'react';
import classNames from 'classnames';

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
      className={classNames(className, 'iron-radio-wrapper', {
        'iron-checkbox-wrapper-disabled': disabled,
      })}
    >
      <span
        className={classNames('iron-radio', {
          'iron-radio-disabled': disabled,
        })}
      >
        <input
          ref={ref}
          type="radio"
          id="iron-radio"
          name="iron-raido"
          value={value}
          {...rest}
          className={classNames('iron-radio-input', {
            'iron-radio-input-disabled': disabled,
          })}
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
        <span
          className={classNames('iron-radio-circle', {
            'iron-radio-circle-checked': isChecked,
            'iron-radio-circle-disabled': disabled,
          })}
        >
          {isChecked && <em className="iron-radio-circle-fill"></em>}
        </span>
      </span>
      {children && <span className="iron-radio-label">{children}</span>}
    </label>
  );
});

export default Radio;
