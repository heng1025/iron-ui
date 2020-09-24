import React from 'react';
import classNames from 'classnames';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import 'antd/es/row/style/css';
import 'antd/es/col/style/css';
import { transformDate, formatValue, transformWord } from './common';
import Icon from '../../icon';
import Tree from '../../tree';
import Input from '../../input';
import Empty from '../../empty';
import Spin from '../../spin';
import Checkbox from '../../checkbox';
import { Options as VirtualOptions } from '../../select';
import { useFilterPicker } from './hooks';

const selectFilterValues = arr => arr.map(v => String(v.value));

function FilterSearch({ value, onChange }) {
  return (
    <Input
      placeholder="Input search keyword"
      value={value}
      onChange={onChange}
      className="iron-table-filter-search"
    />
  );
}

function CheckAll({ indeterminate, checked, count, className, onChange }) {
  return (
    <Checkbox
      className={classNames('checkbox-item', className)}
      indeterminate={indeterminate}
      checked={checked}
      onChange={onChange}
    >
      <em className="text">Select All</em>
      <em className="count">({count})</em>
    </Checkbox>
  );
}

export function FilterHeader({
  disabled,
  loading,
  onSort,
  sort,
  onClear,
  columnType,
  isAdvanceAction,
  onAdvance,
}) {
  return (
    <Row
      className="iron-table-filter-title"
      type="flex"
      justify="space-between"
      align="middle"
    >
      <Col>
        <Icon
          type="sort-ascending"
          onClick={() => onSort('1')}
          style={{ marginRight: 8 }}
          className={classNames('iron-table-filter-icon', {
            active: sort === '1',
          })}
        />
        <Icon
          type="sort-descending"
          onClick={() => onSort('0')}
          className={classNames('iron-table-filter-icon', {
            active: sort === '0',
          })}
        />
      </Col>
      <Col>
        <span
          aria-hidden="true"
          onClick={onAdvance}
          className={classNames('icon-txt', {
            active: isAdvanceAction,
            disabled: loading,
          })}
        >
          <Icon type="filter" className="iron-table-filter-icon" />
          <span role="button">{`${transformWord(columnType)} Filter`}</span>
        </span>
        <span
          aria-hidden="true"
          onClick={onClear}
          className={classNames('iron-table-filter-icon', {
            disabled: disabled,
          })}
        >
          <Icon type="delete" className="iron-table-filter-icon" />
        </span>
      </Col>
    </Row>
  );
}

// type = contain (7)
function FilterCheckbox({ loading, columnType, filterList, ...rest }) {
  const {
    isCheckAll,
    searchVal,
    indeterminate,
    checkedValues,
    handleSeach,
    handleCheckAll,
    handleCheckItem,
  } = useFilterPicker({ filterList, ...rest });

  return (
    <div className="iron-table-filter-checkbox">
      <FilterSearch value={searchVal} onChange={handleSeach} />
      <div className="des">Description</div>
      <Spin spinning={loading}>
        {filterList.length > 0 ? (
          <div className="check-content">
            <CheckAll
              checked={isCheckAll}
              indeterminate={indeterminate}
              onChange={handleCheckAll}
              count={filterList.reduce(
                (acc, { count }) => acc + Number(count),
                0
              )}
            />
            <VirtualOptions height={160} rowHeight={20}>
              {filterList.map(item => {
                const { value, count } = item;
                const strVal = String(value);
                return (
                  <div>
                    <Checkbox
                      key={strVal}
                      value={value}
                      onChange={handleCheckItem}
                    >
                      <span title={strVal}>
                        {formatValue(columnType, value)}
                      </span>
                      <span className="count">({count})</span>
                    </Checkbox>
                  </div>
                );
              })}
            </VirtualOptions>
          </div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Spin>
    </div>
  );
}

function FilterTree({ loading, filterList, ...rest }) {
  const {
    isCheckAll,
    searchVal,
    indeterminate,
    checkedValues,
    handleSeach,
    handleCheckAll,
    handleCheckNode,
  } = useFilterPicker({ filterList, ...rest });

  return (
    <div className="iron-table-filter-checkbox">
      <FilterSearch value={searchVal} onChange={handleSeach} />
      <div className="des">Description</div>
      <Spin spinning={loading}>
        {filterList.length > 0 ? (
          <div className="check-content">
            <CheckAll
              className="check-all"
              checked={isCheckAll}
              indeterminate={indeterminate}
              onChange={handleCheckAll}
              count={filterList.reduce((acc, { count }) => acc + count, 0)}
            />
            <div className="tree-wrap">
              <Tree
                checkable
                defaultExpandAll={false}
                rowClassName="tree-item"
                checkedKeys={selectFilterValues(checkedValues)}
                onCheck={handleCheckNode}
                treeData={transformDate(filterList)}
              />
            </div>
          </div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Spin>
    </div>
  );
}

export function FilterPicker({ columnType, ...rest }) {
  if (columnType === 'date') {
    return <FilterTree {...rest} />;
  }
  return <FilterCheckbox columnType={columnType} {...rest} />;
}
