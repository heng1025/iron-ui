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
  }, [filterList, curColumn, conditions]);

  function updateCheckAllState(checkedList = []) {
    const cLen = checkedList.length;
    const isAllChecked = cLen > 0 && cLen === filterList.length;
    setIndeterminate(cLen === 0 ? false : !isAllChecked);
    setCheckAll(isAllChecked);
  }

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
    [filterList, initList]
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
  requestColumnData,
  requestTableData,
  pageSize = 10,
}) {
  // { column: '', value: '', condition: '7' }
  const [conditions, setConditions] = useState([]);
  // search params
  const [searchConditions, setSearchConditioons] = useState([]);
  const [curColumn, setCurColumn] = useState('');
  const [curSortColumn, setCurSortColumn] = useState('');
  const [curSort, setCurSort] = useState('');
  const [dataSource, setDataSource] = useState([]);

  function clearFilter() {
    setConditions([]);
    setCurColumn('');
    setCurSortColumn('');
    setCurSort('');
  }

  async function fetchTableList(params = {}) {
    const result = await requestTableData({ column: curColumn, ...params });
    setDataSource(result);
  }

  async function fetchSearchTableList(updatedConditions = []) {
    // clear filter params
    clearFilter();
    setSearchConditioons(updatedConditions);
    fetchTableList({
      page: 1,
      pageSize,
      searchConditions: updatedConditions,
    });
  }

  // filter methods
  async function handleCommit(
    column,
    updatedConditions = [],
    shouldClearSearchParams = false
  ) {
    // clear search params
    if (shouldClearSearchParams) {
      setSearchConditioons([]);
    }
    setCurColumn(column);
    setConditions(updatedConditions);
    fetchTableList({
      page: 1, // go back first page
      pageSize,
      conditions: updatedConditions,
      searchConditions: shouldClearSearchParams ? [] : searchConditions,
      sort: curSortColumn === column ? curSort : '',
    });
  }

  async function handleSort(column, sort) {
    setCurColumn(column);
    setCurSortColumn(column);
    setCurSort(sort);
    return fetchTableList({
      sort,
      page: 1,
      pageSize,
      conditions,
      searchConditions,
    });
  }

  async function handlePageChange(p, ps) {
    fetchTableList({
      page: p,
      pageSize: ps,
      conditions,
      searchConditions,
      sort: curSortColumn === curColumn ? curSort : '',
    });
  }

  return {
    conditions,
    dataSource,
    clearFilter,
    fetchTableList,
    fetchSearchTableList,
    handlePageChange,
    handleFilterCommit: handleCommit,
    getTitleProps: (column = curColumn) => ({
      conditions,
      requestColumnData,
      curColumn: column,
      searchConditions,
      sort: curSortColumn === column ? curSort : '',
      onCommit: handleCommit,
      onSort: handleSort,
    }),
  };
}
