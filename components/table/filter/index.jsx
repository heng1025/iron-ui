import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import Advance from './Advance';
import { FilterHeader, FilterPicker } from './Widget';
import Icon from '../../icon';
import Button from '../../button';
import Popover from '../../popover';

export { useColumnFilter } from './hooks';

export function FilterTitle({
  children,
  columnType = 'text', // text, number, date, dateTime
  sort,
  onSort,
  onCommit,
  curColumn,
  conditions,
  requestColumnData,
  searchConditions,
}) {
  const [isFiltered, setFiltered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestErr, setRequestErr] = useState('');
  const [filterItems, setFilterItems] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const [isAdvanceAction, setAdvanceAction] = useState(false);
  const [isAdvanceVisible, setAdvanceVisible] = useState(false);
  const [isResetAdvanceFilter, setResetAdvanceFilter] = useState(false);
  // reset all state
  useEffect(() => {
    if (conditions.length === 0) {
      // click search button
      setFilterItems([]);
      resetState();
    } else {
      setFiltered(conditions.some(item => item.column === curColumn));
    }
  }, [conditions]);

  function showAdvanceFilter() {
    setAdvanceVisible(true);
    setVisible(false);
  }

  function hideAdvanceFilter() {
    setAdvanceVisible(false);
  }

  async function handleAdvanceFilter(factor) {
    if (!factor) {
      setAdvanceVisible(false);
    } else {
      const condition = {
        column: curColumn,
        ...factor,
      };
      let updatedConditions = conditions;
      const curCondition = conditions.find(item => item.column === curColumn);
      if (curCondition) {
        updatedConditions = conditions.map(item =>
          item.column === curColumn ? condition : item
        );
      } else {
        // when checked all item, then exclude current condition
        updatedConditions.push(condition);
      }
      await onCommit(curColumn, updatedConditions);
      // filter icon change
      setFiltered(true);
      setVisible(false);
      setAdvanceAction(true);
      setAdvanceVisible(false);
      setResetAdvanceFilter(false);
    }
  }

  async function handleVisibleChange(v) {
    setVisible(v);
    if (v) {
      setLoading(true);
      try {
        const filters = await requestColumnData({
          column: curColumn,
          searchConditions,
          conditions: conditions.filter(item => item.column !== curColumn),
        });
        setFilterItems(filters || []);
      } catch (error) {
        setRequestErr(typeof error === 'string' ? error : 'Err happened');
      }
      setLoading(false);
    }
  }

  function handleCheckList(val) {
    setCheckedList(val);
  }

  function resetState() {
    setFiltered(false);
    setVisible(false);
    setAdvanceAction(false);
    setResetAdvanceFilter(true);
  }

  async function handleClear() {
    const updatedConditions = conditions.filter(
      item => item.column !== curColumn
    );
    await onCommit(curColumn, updatedConditions);
    resetState();
  }

  async function handleSort(s) {
    if (s !== sort) {
      await onSort(curColumn, s);
    }
    setVisible(false);
  }

  async function handleOk() {
    const values = checkedList.map(item => item.value);

    const condition = {
      column: curColumn,
      value: Array.isArray(values) ? values : String(values).split(','),
      condition: 7,
    };
    let updatedConditions = conditions;
    const curCondition = conditions.find(item => item.column === curColumn);
    if (curCondition) {
      // when checked all item, then exclude current condition
      if (values.length === filterItems.length) {
        updatedConditions = conditions.filter(
          item => item.column !== curColumn
        );
      } else {
        updatedConditions = conditions.map(item =>
          item.column === curColumn ? condition : item
        );
      }
    } else if (values.length !== filterItems.length) {
      // when checked all item, then exclude current condition
      updatedConditions.push(condition);
    }
    await onCommit(curColumn, updatedConditions);
    // filter icon change
    setFiltered(checkedList.length !== filterItems.length);
    setVisible(false);
    setAdvanceAction(false);
    setResetAdvanceFilter(true);
  }

  return (
    <div>
      <Advance
        columnType={columnType}
        filterList={filterItems}
        visible={isAdvanceVisible}
        isReset={isResetAdvanceFilter}
        onCancel={hideAdvanceFilter}
        onOk={handleAdvanceFilter}
      />
      <Popover
        placement="bottomLeft"
        trigger="click"
        visible={visible}
        onVisibleChange={handleVisibleChange}
        overlayStyle={{ width: 280 }}
        content={
          <>
            <FilterHeader
              loading={loading}
              disabled={
                !isFiltered && checkedList.length === filterItems.length
              }
              onClear={handleClear}
              sort={sort}
              onSort={handleSort}
              columnType={columnType}
              isAdvanceAction={isAdvanceAction}
              onAdvance={showAdvanceFilter}
            />
            <div className="iron-table-filter">
              <FilterPicker
                loading={loading}
                requestErr={requestErr}
                filterList={filterItems}
                columnType={columnType}
                curColumn={curColumn}
                conditions={conditions}
                onCheckedList={handleCheckList}
              />
              <div className="iron-table-filter-btns">
                <Button onClick={() => setVisible(false)}>Cancel</Button>
                <Button
                  type="primary"
                  disabled={loading || !checkedList.length}
                  onClick={handleOk}
                >
                  Commit
                </Button>
              </div>
            </div>
          </>
        }
      >
        <Icon
          type="filter"
          className={classNames('iron-table-filter-icon', {
            active: isFiltered,
          })}
        />
      </Popover>
      <span>{children}</span>
    </div>
  );
}
