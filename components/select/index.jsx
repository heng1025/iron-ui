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
import Icon from 'antd/es/icon';
import Input from 'antd/es/input';
import { Options } from './common';

const VirtualSelect = forwardRef((props, ref) => {
  const {
    value,
    onChange,
    allowClear,
    style,
    children = [],
    loading,
    showSearch,
    disabled,
    placeholder,
    filterOption,
    onSearch,
    onFocus,
    suffix,
    optionContainerStyle,
    optionTitle, // ReactNode
  } = props;

  const selectRef = useRef(null);
  const inputRef = useRef(null);
  const [label, setLabel] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [closeIconVisible, setCloseIconVisible] = useState(false);
  const [filterList, setFilterList] = useState([]);

  useEffect(() => {
    if (children.length > 0) {
      setFilterList(children);
    } else {
      setFilterList([]);
    }
  }, [children]);

  // show default value
  useEffect(() => {
    if (value) {
      const { curLabel, matchValue } = children.reduce(
        (acc, child = {}) => {
          if (String(child.key) === String(value)) {
            acc.curLabel = child;
          }
          const { value: text = child.key } = child.props;
          const formatInput = decodeURIComponent(value).toLowerCase();
          const formatVal = String(text).toLowerCase();
          if (formatInput === formatVal) {
            acc.matchValue = child;
          }
          return acc;
        },
        { curLabel: null, matchValue: null }
      );

      if (curLabel && typeof curLabel.props.children === 'string') {
        setLabel(curLabel.props.children);
      } else {
        setLabel(value);
      }

      // default selected
      if (matchValue) {
        setSelectedValue(matchValue.key);
      }
    } else {
      setLabel('');
      setSelectedValue('');
    }
  }, [value, children]);

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

  useEffect(() => {
    if (inputRef && inputRef.current) {
      if (searchVisible) {
        inputRef.current.focus();
      } else {
        inputRef.current.blur();
        // clear search value
        setSearchValue('');
      }
    }
  }, [searchVisible]);

  // select operation
  const handleClick = (item) => {
    setSelectedValue(item.key);
    setLabel(item.value);
    setSearchVisible(false);
    if (onChange) {
      onChange(item.value, item);
    }
  };

  const handleChange = useCallback(
    debounce((inputVal) => {
      if (onSearch) {
        onSearch(inputVal);
      } else if (showSearch) {
        let sList = [];
        if (filterOption) {
          sList = children.filter((item) => filterOption(inputVal, item));
        } else {
          const formatInput = decodeURIComponent(inputVal).toLowerCase();
          sList = children.filter((item) => {
            const { value: text = item.key } = item.props;
            const formatVal = String(text).toLowerCase();
            return formatVal.includes(formatInput);
          });
        }
        setFilterList(!inputVal ? children : sList);
      }
    }, 500),
    [children]
  );

  const onChangeInput = (e) => {
    const inputVal = e.target.value;
    setSearchValue(inputVal);
    handleChange(inputVal);
  };

  return (
    <div
      ref={selectRef}
      style={style}
      className={classNames('iron-select-container', props.className)}
      onMouseEnter={() => {
        if (label && allowClear && !disabled) {
          setCloseIconVisible(true);
        }
      }}
      onMouseLeave={() => {
        if (label && allowClear && !disabled) {
          setCloseIconVisible(false);
        }
      }}
    >
      <Input
        ref={inputRef}
        readOnly={!showSearch}
        value={searchValue}
        onChange={onChangeInput}
        placeholder={label || placeholder}
        suffix={!suffix && <Icon type="up" />}
        className="iron-select-input"
        style={{ display: searchVisible ? 'inline-block' : 'none' }}
      />
      <Input
        ref={ref}
        readOnly
        placeholder={placeholder}
        disabled={disabled}
        value={label}
        className={classNames(
          'iron-select-input',
          showSearch ? 'iron-select-default' : ''
        )}
        style={{ display: !searchVisible ? 'inline-block' : 'none' }}
        suffix={
          <>
            <span
              style={{ display: !closeIconVisible ? 'inline-block' : 'none' }}
            >
              {suffix || <Icon type="down" />}
            </span>
            {allowClear && !disabled && label && (
              <span
                className="icon-close"
                style={{ display: closeIconVisible ? 'inline-block' : 'none' }}
                onClick={() => {
                  setLabel('');
                  setSearchValue('');
                  setSelectedValue('');
                  setCloseIconVisible(false);
                  if (onChange) {
                    onChange();
                  }
                }}
              >
                <Icon type="close-circle" theme="filled" />
              </span>
            )}
          </>
        }
        onFocus={() => {
          if (onFocus) {
            onFocus();
          }
          // restore default list
          if (onSearch) {
            onSearch('');
          } else {
            setFilterList(children);
          }
          setSearchVisible(true);
        }}
      />
      {searchVisible && (
        <div style={optionContainerStyle} className="iron-select-options">
          {optionTitle}
          <Options
            selected={selectedValue}
            className="iron-select-option-item"
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

VirtualSelect.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  /**
   * Current selected option
   */
  value: PropTypes.string,
  /**
   * Called when select an option or input value change
   */
  onChange: PropTypes.func,
  /**
   * Show clear button
   */
  allowClear: PropTypes.bool,
  style: PropTypes.object,
  optionContainerStyle: PropTypes.object,
  optionTitle: PropTypes.element,
  /**
   * Indicate loading state
   */
  loading: PropTypes.bool,
  /**
   *
   */
  showSearch: PropTypes.bool,
  disabled: PropTypes.bool,
  /**
   * Placeholder of select
   */
  placeholder: PropTypes.string,
  /**
   * The function will receive two arguments,
   * inputValue and option, if the function returns true,
   * the option will be included in the filtered set;
   * Otherwise, it will be excluded
   */
  filterOption: PropTypes.func,
  onSearch: PropTypes.func,
  /**
   * Called when focus
   */
  onFocus: PropTypes.func,
  /**
   * The custom suffix icon
   */
  suffix: PropTypes.element,
};

VirtualSelect.defaultProps = {
  allowClear: false,
  loading: false,
  showSearch: false,
  disabled: false,
  placeholder: 'please select',
};

export default VirtualSelect;
