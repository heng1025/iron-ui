import React, { forwardRef, useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import Icon from '../icon';

const Checkbox = forwardRef((props, ref) => {
  const {
    children,
    value,
    disabled = false,
    checked = false,
    defaultChecked = false,
    indeterminate = false,
    onChange,
    className,
    ...rest
  } = props;
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
          value={value}
          {...rest}
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
  const checkboxGroupRef = useRef(null);
  const [checkedVals, setCheckedVals] = useState([...defaultValue, ...value]);
  // console.log('children', children);

  useEffect(() => {
    const ele = checkboxGroupRef.current;
    let values = [...checkedVals];
    const handler = e => {
      console.log('e', e.target);
      const { checked, value: val } = e.target;
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
    if (ele) {
      ele.addEventListener('change', handler);
    }

    return () => {
      if (ele) {
        ele.removeEventListener('change', handler);
      }
    };
  }, [onChange, checkedVals]);

  return (
    <div className="iron-checkbox-group" ref={checkboxGroupRef}>
      {React.Children.map(children, child => {
        console.log(child.props.children.length);
        const { props } = child;
        return React.cloneElement(child, {
          defaultChecked: defaultValue.some(item => item === props.value),
          checked: value.some(item => item === props.value),
          disabled,
        });
      })}
    </div>
  );
};

Checkbox.Group = Group;
export default Checkbox;
