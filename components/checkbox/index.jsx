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
    className,
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
      className={classNames(className, 'iron-checkbox-wrapper', {
        'iron-checkbox-wrapper-disabled': disabled,
      })}
    >
      <span
        className={classNames('iron-checkbox', {
          'iron-checkbox-no-children': !children,
          'iron-checkbox-disabled': disabled,
        })}
      >
        <input
          ref={ref}
          type="checkbox"
          id="iron-checkbox"
          {...rest}
          className={classNames('iron-checkbox-input', {
            'iron-checkbox-input-disabled': disabled,
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
          className={classNames('iron-checkbox-square', {
            'iron-checkbox-checked': isChecked,
            'iron-checkbox-disabled': disabled,
          })}
        >
          {getCheckIcon()}
        </span>
      </span>
      {children && <span className="iron-checkbox-label">{children}</span>}
    </label>
  );
});

export default Checkbox;
