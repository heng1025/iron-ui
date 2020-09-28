import React, { forwardRef, useEffect, useState, useContext } from 'react';
import classNames from 'classnames';
import RadioGroupContext, { RadioGroupContextProvider } from './context';

const Radio = forwardRef((props, ref) => {
  const { children, value, className, ...restProps } = props;

  const context = useContext(RadioGroupContext);
  const radioProps = {
    ...restProps,
  };

  if (context) {
    radioProps.onChange = context.onChange || props.onChange;
    radioProps.checked = context.value === props.value;
    radioProps.disabled = props.disabled || context.disabled;
  }

  const {
    disabled = false,
    checked = false,
    defaultChecked = false,
    onChange,
    ...otherProps
  } = radioProps;

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
          {...otherProps}
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

const Group = ({
  value,
  defaultValue,
  disabled = false,
  onChange,
  children,
}) => {
  const [curVal, setVal] = useState(value || defaultValue);

  const handleChange = ev => {
    setVal(ev.target.value);
    if (onChange) {
      onChange(ev);
    }
  };

  return (
    <RadioGroupContextProvider
      value={{
        onChange: handleChange,
        value: curVal,
        disabled,
      }}
    >
      <div className="iron-radio-group">{children}</div>
    </RadioGroupContextProvider>
  );
};

Radio.displayName = 'Radio';
Group.displayName = 'Radio.Group';

Radio.Group = Group;
export default Radio;
