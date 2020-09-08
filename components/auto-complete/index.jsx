import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import debounce from 'lodash/debounce';
import classNames from 'classnames';
import Input from 'antd/es/input';
import { Options } from '../select/common';

const VirtualAutoComplete = forwardRef((props, ref) => {
  const {
    value,
    onChange,
    children = [],
    loading,
    disabled,
    style,
    placeholder = 'Please input',
    suffix,
    filterOption,
    isFixedMode,
    optionContainerStyle,
    optionTitle, // ReactNode
    onFocus,
    onBlur,
  } = props;

  const selectRef = useRef(null);
  const [selectedValue, setSelectedValue] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchValue, setSearchValue] = useState(undefined);
  const [filterList, setFilterList] = useState([]);

  const queryOptions = useCallback(
    debounce((inputVal, list, condition, fixedMode) => {
      if (inputVal) {
        const formatInput = decodeURIComponent(inputVal).toLowerCase();
        if (fixedMode) {
          const matchValue = list.find((item) => {
            const { value: text = item.key } = item.props;
            const formatVal = String(text).toLowerCase();
            return formatVal === formatInput;
          });
          setSelectedValue(matchValue ? matchValue.key : '');
        } else {
          let sList = [];
          if (condition) {
            sList = list.filter((item) => condition(inputVal, item));
          } else {
            sList = list.filter((item) => {
              const { value: text = item.key } = item.props;
              const formatVal = String(text).toLowerCase();
              return formatVal.includes(formatInput);
            });
          }
          setFilterList(sList);
        }
      } else {
        setFilterList(list);
        setSelectedValue('');
      }
    }, 100),
    []
  );

  useEffect(() => {
    setSearchValue(value);
    if (children.length > 0) {
      queryOptions(value, children, filterOption, isFixedMode);
    } else {
      setFilterList([]);
    }
  }, [value, children, isFixedMode]);

  useEffect(() => {
    const optionWrap = selectRef.current;
    const handler = (e) => {
      if (optionWrap && !optionWrap.contains(e.target)) {
        setSearchVisible(false);
      }
    };
    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('click', handler);
    };
  }, []);

  const handleClick = (item) => {
    setSelectedValue(item.key);
    setSearchValue(item.value);
    setSearchVisible(false);
    if (onChange) {
      // item only select used
      onChange(item.value, item);
    }
  };

  const onChangeInput = (e) => {
    const inputVal = e.target.value;
    setSearchValue(inputVal);
    if (onChange) {
      onChange(inputVal);
    }
  };

  return (
    <div
      style={style}
      className={classNames('iron-select-container', props.className)}
      ref={selectRef}
    >
      <Input
        ref={ref}
        disabled={disabled}
        value={searchValue}
        onChange={onChangeInput}
        suffix={suffix}
        placeholder={placeholder}
        onBlur={() => {
          if (onBlur) {
            onBlur(searchValue);
          }
        }}
        onFocus={() => {
          setSearchVisible(true);
          if (onFocus) {
            onFocus();
          }
        }}
      />
      {searchVisible && (
        <div style={optionContainerStyle} className="iron-select-options">
          {optionTitle}
          <Options
            className="iron-select-option-item"
            selected={selectedValue}
            loading={loading}
            onClick={handleClick}
          >
            {filterList}
          </Options>
        </div>
      )}
    </div>
  );
});

export default VirtualAutoComplete;
