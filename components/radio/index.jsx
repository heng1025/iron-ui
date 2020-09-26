import React, { forwardRef, useEffect, useState } from 'react';
import classNames from 'classnames';

const Radio = forwardRef((props, ref) => {
  const {
    children,
    value,
    className,
    disabled = false,
    checked = false,
    defaultChecked = false,
    onChange,
    ...rest
  } = props;
  const [isChecked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(defaultChecked || checked);
  }, [defaultChecked, checked]);

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      className={classNames(className, 'iron-radio-wrapper', {
        'iron-radio-wrapper-disabled': disabled,
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
          value={value}
          disabled={disabled}
          // expect boolean
          checked={!!isChecked}
          {...rest}
          className={classNames('iron-radio-input', {
            'iron-radio-input-disabled': disabled,
          })}
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
          {isChecked && <em className="iron-radio-circle-fill" />}
        </span>
      </span>
      {children && <span className="iron-radio-label">{children}</span>}
    </label>
  );
});

const Group = ({ value, defaultValue, onChange, children }) => {
  const [curDefaultVal, setDefaultVal] = useState(defaultValue);
  const [curVal, setVal] = useState(value);
  return (
    <div className="iron-radio-group">
      {React.Children.map(children, child => {
        const { props } = child;
        return React.cloneElement(child, {
          defaultChecked: curDefaultVal === props.value,
          checked: curVal === props.value,
          onChange(e) {
            setDefaultVal('');
            setVal(e.target.value);
            if (onChange) {
              onChange(e);
            }
          },
        });
      })}
    </div>
  );
};

Radio.Group = Group;
export default Radio;
