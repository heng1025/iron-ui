import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

import { getDays } from './common';

// filterList: [{value:'abc',count:1},{value:'bbb',count:19}]
export function useFilterPicker({
  filterList,
  curColumn,
  conditions,
  onCheckedList,
}) {
  const [isCheckAll, setCheckAll] = useState(true);
  const [indeterminate, setIndeterminate] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [initList, setInitList] = useState([]);
  const [checkedValues, setCheckedValues] = useState([]);

  const updateCheckAllState = useCallback(
    (checkedList = []) => {
      const cLen = checkedList.length;
      const isAllChecked = cLen > 0 && cLen === filterList.length;
      setIndeterminate(cLen === 0 ? false : !isAllChecked);
      setCheckAll(isAllChecked);
    },
    [filterList]
  );

  useEffect(() => {
    setSearchVal('');
    const curFilter = conditions.find(item => item.column === curColumn);
    if (curFilter) {
      const { condition, value, condition1, value1, andOr } = curFilter;

      let values = [];

      if (andOr === 'or' && +condition === 1 && +condition1 === 1) {
        values = [...value, ...value1];
      } else if (!condition1 && [1, 7].includes(+condition)) {
        // (7) represet check filter item
        values = [...value];
      } else if (!condition && +condition1 === 1) {
        values = [...value1];
      }

      const sList = filterList.filter(({ value: val }) =>
        values.some(v => String(val) === decodeURIComponent(v))
      );

      setInitList(sList);
      setCheckedValues(sList);
      onCheckedList(sList);
      updateCheckAllState(sList);
    } else {
      // reset
      setInitList(filterList);
      setCheckedValues(filterList);
      updateCheckAllState(filterList);
    }
  }, [filterList, curColumn, conditions, onCheckedList, updateCheckAllState]);

  function handleCheckItem(e) {
    const { value: cVal, checked } = e.target;

    const cList = checked
      ? [...checkedValues, { value: cVal }]
      : checkedValues.filter(item => String(item.value) !== String(cVal));

    setCheckedValues(cList);
    onCheckedList(cList);
    updateCheckAllState(cList);
  }

  function handleCheckNode(_, info) {
    const { checkedNodes } = info;
    // just get day,exclude year and month
    const days = getDays(checkedNodes).map(v => ({ value: v }));
    setCheckedValues(days);
    onCheckedList(days);
    // update check all state
    updateCheckAllState(days);
  }

  function handleCheckAll(e) {
    const { checked } = e.target;
    const checkedList = checked ? filterList : [];
    setCheckedValues(checkedList);
    onCheckedList(checkedList);
    updateCheckAllState(checkedList);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceInputChange = useCallback(
    debounce(value => {
      const sList = filterList.filter(item => {
        const formatVal = String(item.value).toLowerCase();
        return formatVal.includes(value.toLowerCase());
      });
      const checkedList = !value ? initList : sList;
      setCheckedValues(checkedList);
      onCheckedList(checkedList);
      updateCheckAllState(checkedList);
    }, 500),
    [filterList, initList, onCheckedList, updateCheckAllState]
  );

  function handleSeach(e) {
    const { value = '' } = e.target;
    setSearchVal(value);
    debounceInputChange(value);
  }

  return {
    isCheckAll,
    indeterminate,
    searchVal,
    checkedValues,
    handleSeach,
    handleCheckAll,
    handleCheckItem,
    handleCheckNode,
  };
}

export function useColumnFilter({
  extraParams = {},
  fetchColData,
  fetchTabData,
  onDataSourceChange,
}) {
  // { column: '', value: '', condition: '7' }
  const [conditions, setConditions] = useState([]);
  // search params
  const [curSort, setCurSort] = useState('');
  const [curColumn, setCurColumn] = useState('');
  const [curSortColumn, setCurSortColumn] = useState('');

  const { pageSize = 10, searchConditions } = extraParams;

  async function fetchTableList(column, params = {}) {
    const result = await fetchTabData({ column, ...params });
    onDataSourceChange(result);
  }

  // filter methods
  async function handleCommit(column, updatedConditions = []) {
    setCurColumn(column);
    setConditions(updatedConditions);
    fetchTableList(column, {
      page: 1, // go back first page
      pageSize,
      conditions: updatedConditions,
      searchConditions,
      sort: curSortColumn === column ? curSort : '',
    });
  }

  async function handleSort(column, sort) {
    setCurColumn(column);
    setCurSortColumn(column);
    setCurSort(sort);
    fetchTableList(column, {
      sort,
      page: 1,
      pageSize,
      conditions,
      searchConditions,
    });
  }

  return {
    conditions,
    searchConditions,
    fetchColData,
    sort: curSortColumn === curColumn ? curSort : '',
    onCommit: handleCommit,
    onSort: handleSort,
  };
}
