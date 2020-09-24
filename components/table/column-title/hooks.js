import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import { getDays } from './common';

export const actionType = 'global/fetchTableList';

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
  dispatch,
  queryList,
  pageSize,
  options = {},
  tableName = 'SLOP_BIZ.V_ALERT_CENTER',
}) {
  // { column: '', value: '', condition: '7' }
  const [conditions, setConditions] = useState([]);
  // search params
  const [searchConditions, setSearchConditioons] = useState([]);
  const [curTableColumn, setCurTableColumn] = useState('');
  const [curSortColumn, setCurSortColumn] = useState('');
  const [curSort, setCurSort] = useState('');

  function clearFilter() {
    setConditions([]);
    setCurTableColumn('');
    setCurSortColumn('');
    setCurSort('');
  }

  function fetchTableList(params = {}, dataTable = tableName) {
    const { clearSelectedKeys } = options;
    if (clearSelectedKeys) {
      clearSelectedKeys();
    }
    if (queryList) {
      queryList({
        ...params,
        dataTable,
      });
    } else {
      dispatch({
        type: actionType,
        payload: {
          ...params,
          dataTable,
        },
      });
    }
  }

  function fetchSearchTableList(updatedConditions = [], dataTable = tableName) {
    // clear filter params
    clearFilter();
    setSearchConditioons(updatedConditions);
    fetchTableList(
      {
        page: 1,
        pageSize,
        searchConditions: updatedConditions,
      },
      dataTable
    );
  }

  // filter methods
  async function handleCommit(
    tableColumn,
    updatedConditions = [],
    shouldClearSearchParams = false
  ) {
    // clear search params
    if (shouldClearSearchParams) {
      setSearchConditioons([]);
    }
    setCurTableColumn(tableColumn);
    setConditions(updatedConditions);
    fetchTableList({
      page: 1, // go back first page
      pageSize,
      currentColumn: tableColumn,
      conditions: updatedConditions,
      searchConditions: shouldClearSearchParams ? [] : searchConditions,
      sort: curSortColumn === tableColumn ? curSort : '',
    });
  }

  async function handleSort(tableColumn, sort) {
    setCurTableColumn(tableColumn);
    setCurSortColumn(tableColumn);
    setCurSort(sort);
    fetchTableList({
      sort,
      page: 1,
      pageSize,
      conditions,
      searchConditions,
      currentColumn: tableColumn,
    });
  }

  async function handlePageChange(p, ps) {
    fetchTableList({
      page: p,
      pageSize: ps,
      conditions,
      searchConditions,
      currentColumn: curTableColumn,
      sort: curSortColumn === curTableColumn ? curSort : '',
    });
  }

  return {
    conditions,
    clearFilter,
    fetchTableList,
    fetchSearchTableList,
    handlePageChange,
    handleFilterCommit: handleCommit,
    getTitleProps: (column = curTableColumn) => ({
      curColumn: column,
      conditions,
      searchConditions,
      tableName,
      sort: curSortColumn === column ? curSort : '',
      onCommit: handleCommit,
      onSort: handleSort,
    }),
  };
}

// ColumnTitle Hoc (equals useColumnFilter in FC)
export function withFilterList({ tableName }) {
  return function wrapper(WrappedComponent) {
    class Hoc extends React.PureComponent {
      static display = WrappedComponent.displayName || WrappedComponent.name || 'Component';

      state = {
        conditions: [],
        searchConditions: [],
        curTableColumn: '',
        curSortColumn: '',
        curSort: '',
      };

      passThroughProps = () => {
        const {
          conditions,
          searchConditions,
          curSortColumn,
          curSort,
        } = this.state;
        return {
          conditions,
          clearFilter: this.clearFilter,
          fetchTableList: this.fetchTableList,
          fetchSearchTableList: this.fetchSearchTableList,
          handlePageChange: this.handlePageChange,
          handleFilterCommit: this.handleCommit,
          getTitleProps: (column = this.state.curTableColumn) => ({
            curColumn: column,
            conditions,
            searchConditions,
            tableName,
            sort: curSortColumn === column ? curSort : '',
            onCommit: this.handleCommit,
            onSort: this.handleSort,
          }),
        };
      };

      clearFilter = () => {
        this.setState({
          conditions: [],
          curTableColumn: '',
          curSortColumn: '',
          curSort: '',
        });
      };

      fetchTableList = async (params = {}, dataTable = tableName) => {
        const { dispatch } = this.props;
        const { queryList, options = {} } = this.props;
        const { clearSelectedKeys } = options;
        if (clearSelectedKeys) {
          clearSelectedKeys();
        }
        if (queryList) {
          queryList({
            ...params,
            dataTable,
          });
        } else {
          dispatch({
            type: actionType,
            payload: {
              ...params,
              dataTable,
            },
          });
        }
      };

      fetchSearchTableList = async (
        updatedConditions = [],
        dataTable = tableName
      ) => {
        const { pageSize } = this.props;
        // clear filter params
        this.clearFilter();
        this.setState({ searchConditions: updatedConditions });
        this.fetchTableList(
          {
            page: 1,
            pageSize,
            searchConditions: updatedConditions,
          },
          dataTable
        );
      };

      // filter methods
      handleCommit = async (
        tableColumn,
        updatedConditions = [],
        shouldClearSearchParams = false
      ) => {
        // clear search params
        if (shouldClearSearchParams) {
          this.setState({ searchConditions: [] });
        }
        const { pageSize } = this.props;
        const { curSortColumn, curSort, searchConditions } = this.state;
        this.setState({
          curTableColumn: tableColumn,
          conditions: updatedConditions,
        });
        this.fetchTableList({
          page: 1, // go back first page
          pageSize,
          currentColumn: tableColumn,
          conditions: updatedConditions,
          searchConditions: shouldClearSearchParams ? [] : searchConditions,
          sort: curSortColumn === tableColumn ? curSort : '',
        });
      };

      handleSort = async (tableColumn, sort) => {
        const { pageSize } = this.props;
        const { conditions, searchConditions } = this.state;
        this.setState({
          curTableColumn: tableColumn,
          curSortColumn: tableColumn,
          curSort: sort,
        });
        this.fetchTableList({
          sort,
          page: 1,
          pageSize,
          conditions,
          searchConditions,
          currentColumn: tableColumn,
        });
      };

      handlePageChange = async (p, ps) => {
        const {
          curTableColumn,
          curSortColumn,
          curSort,
          conditions,
          searchConditions,
        } = this.state;
        this.fetchTableList({
          page: p,
          pageSize: ps,
          conditions,
          searchConditions,
          currentColumn: curTableColumn,
          sort: curSortColumn === curTableColumn ? curSort : '',
        });
      };

      render() {
        return (
          <WrappedComponent {...this.props} {...this.passThroughProps()} />
        );
      }
    }

    return connect()(Hoc);
  };
}
