import React, { useState, useEffect } from 'react';
import { Popover, Button } from 'antd';
import classNames from 'classnames';
import Icon from '../../icon';
import AdvanceFilter from './AdvanceFilter';
import { FilterHeader, FilterPicker } from './FilterContent';
import styles from './index.less';

export { useColumnFilter, withFilterList, actionType } from './hooks';

function ColumnFilter({
  dispatch,
  loading,
  children,
  columnType = 'text', // text, number, date, dateTime
  sort,
  onSort,
  onCommit,
  curColumn,
  conditions,
  searchConditions,
  tableName = 'SLOP_BIZ.V_ALERT_CENTER',
}) {
  const [isFiltered, setFiltered] = useState(false);
  const [visible, setVisible] = useState(false);
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
      const filters = await dispatch({
        type: 'global/fetchTableFilterItems',
        payload: {
          tableName,
          searchConditions,
          conditions: conditions.filter(item => item.column !== curColumn),
          tableColumn: curColumn,
        },
      });
      setFilterItems(filters || []);
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
    <>
      <AdvanceFilter
        loading={loading}
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
        overlayClassName={styles.container}
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
            <div className={styles.content}>
              <FilterPicker
                loading={loading}
                filterList={filterItems}
                columnType={columnType}
                curColumn={curColumn}
                conditions={conditions}
                onCheckedList={handleCheckList}
              />
              <div className={styles['bottom-btns']}>
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
        <div>
          <Icon
            type="iconfilter1"
            className={classNames(styles['filter-icon'], {
              [styles.active]: isFiltered,
            })}
          />
          <span>{children}</span>
        </div>
      </Popover>
    </>
  );
}

export default ColumnFilter;
