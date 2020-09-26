import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import classNames from 'classnames';
import Input from '../input';
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
    fixedMode,
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const queryOptions = useCallback(
    debounce((inputVal, list, condition, isFixed) => {
      if (inputVal) {
        const formatInput = decodeURIComponent(inputVal).toLowerCase();
        if (isFixed) {
          const matchValue = list.find(item => {
            const { value: text = item.key } = item.props;
            const formatVal = String(text).toLowerCase();
            return formatVal === formatInput;
          });
          setSelectedValue(matchValue ? matchValue.key : '');
        } else {
          let sList = [];
          if (condition) {
            sList = list.filter(item => condition(inputVal, item));
          } else {
            sList = list.filter(item => {
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
      queryOptions(value, children, filterOption, fixedMode);
    } else {
      setFilterList([]);
    }
  }, [queryOptions, filterOption, value, children, fixedMode]);

  useEffect(() => {
    const optionWrap = selectRef.current;
    const handler = e => {
      if (optionWrap && !optionWrap.contains(e.target)) {
        setSearchVisible(false);
      }
    };
    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('click', handler);
    };
  }, []);

  const handleClick = item => {
    setSelectedValue(item.key);
    setSearchValue(item.value);
    setSearchVisible(false);
    if (onChange) {
      // item only select used
      onChange(item.value, item);
    }
  };

  const onChangeInput = e => {
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

VirtualAutoComplete.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  /**
   * Current selected option
   */
  value: PropTypes.string,
  /**
   * Called when select an option or input value change
   */
  onChange: PropTypes.func,
  style: PropTypes.object,
  optionContainerStyle: PropTypes.object,
  optionTitle: PropTypes.element,
  /**
   * Indicate loading state
   */
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  fixedMode: PropTypes.bool,
  placeholder: PropTypes.string,
  /**
   * The function will receive two arguments,
   * inputValue and option, if the function returns true,
   * the option will be included in the filtered set;
   * Otherwise, it will be excluded
   */
  filterOption: PropTypes.func,
  /**
   * Called when focus
   */
  onFocus: PropTypes.func,
  /**
   * Called when blur
   */
  onBlur: PropTypes.func,
};

export default VirtualAutoComplete;
