import React, { forwardRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import Icon from '../icon';

const Checkbox = forwardRef((props, ref) => {
  const {
    children,
    disabled,
    checked,
    defaultChecked,
    indeterminate,
    onChange,
    ...rest
  } = props;
  const [isChecked, setChecked] = useState(false);

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
    <label
      htmlFor="iron-checkbox"
      className={classNames(
        'iron-checkbox-wrapper',
        disabled ? 'iron-checkbox-wrapper-disabled' : ''
      )}
    >
      <span
        className={classNames(
          'iron-checkbox',
          !children ? 'iron-checkbox-no-children' : '',
          disabled ? 'iron-checkbox-disabled' : ''
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          id="iron-checkbox"
          {...rest}
          className={classNames(
            'iron-checkbox-input',
            disabled ? 'iron-checkbox-input-disabled' : ''
          )}
          disabled={disabled}
          defaultChecked={defaultChecked}
          // expect boolean
          checked={!!isChecked}
          onChange={(e) => {
            setChecked(e.target.checked);
            if (onChange) {
              onChange(e);
            }
          }}
        />
        <span
          className={classNames(
            'iron-checkbox-square',
            isChecked ? 'iron-checkbox-checked' : '',
            disabled ? 'iron-checkbox-disabled' : '',
          )}
        >
          {getCheckIcon()}
        </span>
      </span>

      {children && <span className="iron-checkbox-label">{children}</span>}
    </label>
  );
});

export default Checkbox;
