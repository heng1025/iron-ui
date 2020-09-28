import React, { forwardRef, useEffect, useState, useContext } from 'react';
import classNames from 'classnames';
import Icon from '../icon';
import CheckboxGroupContext, { CheckboxGroupContextProvider } from './context';

const Checkbox = forwardRef((props, ref) => {
  const { children, className, ...restProps } = props;
  const context = useContext(CheckboxGroupContext);
  const checkboxProps = {
    ...restProps,
  };

  const handleChange = e => {
    if (props.onChange) {
      props.onChange(e);
    }
    if (context && context.onChange) {
      context.onChange(e);
    }
  };

  if (context) {
    checkboxProps.onChange = handleChange;
    checkboxProps.checked = context.value.some(v => v === props.value);
    checkboxProps.disabled = props.disabled || context.disabled;
  }
  const {
    disabled = false,
    checked = false,
    defaultChecked = false,
    indeterminate = false,
    onChange,
    ...otherProps
  } = checkboxProps;

  const [isChecked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(defaultChecked || checked);
  }, [defaultChecked, checked]);

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
          {...otherProps}
          className={classNames('iron-checkbox-input', {
            'iron-checkbox-input-disabled': disabled,
          })}
          disabled={disabled}
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

const Group = ({
  value = [],
  defaultValue = [],
  onChange,
  disabled,
  children,
}) => {
  const [checkedVals, setCheckedVals] = useState([...defaultValue, ...value]);

  const handleChange = e => {
    const { checked, value: val } = e.target || {};
    let values = [...checkedVals];
    if (checked) {
      values.push(val);
    } else {
      values = values.filter(v => v !== val);
    }
    setCheckedVals(values);
    if (onChange) {
      onChange(values);
    }
  };

  return (
    <CheckboxGroupContextProvider
      value={{
        onChange: handleChange,
        value,
        disabled,
      }}
    >
      <div className="iron-checkbox-group">{children}</div>
    </CheckboxGroupContextProvider>
  );
};

Checkbox.displayName = 'Checkbox';
Group.displayName = 'Checkbox.Group';

Checkbox.Group = Group;
export default Checkbox;
