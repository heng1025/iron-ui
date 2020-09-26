import React, { forwardRef, useEffect, useRef, useState } from 'react';
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

  // radio group need update
  useEffect(() => {
    setChecked(checked || defaultChecked);
  }, [checked, defaultChecked]);

  return (
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
          checked={isChecked}
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

const Group = ({ value, defaultValue, disabled, onChange, children }) => {
  const radioGroupRef = useRef(null);
  const [curVal, setVal] = useState(value);
  const [curDefaultVal, setDefaultVal] = useState(defaultValue);

  useEffect(() => {
    const ele = radioGroupRef.current;
    const handler = e => {
      setDefaultVal('');
      setVal(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };
    if (ele) {
      ele.addEventListener('change', handler);
    }

    return () => {
      if (ele) {
        ele.removeEventListener('change', handler);
      }
    };
  }, [onChange]);

  return (
    <div className="iron-radio-group" ref={radioGroupRef}>
      {React.Children.map(children, child => {
        const { props } = child;
        return React.cloneElement(child, {
          defaultChecked: curDefaultVal === props.value,
          checked: curVal === props.value,
          disabled,
        });
      })}
    </div>
  );
};

Radio.Group = Group;
export default Radio;
