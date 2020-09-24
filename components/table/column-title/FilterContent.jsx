import React from 'react';
import classNames from 'classnames';
import { Row, Col, Input, Checkbox, Empty, Spin } from 'antd';
import Icon from '../../icon';
import Tree from '../../tree';
import { Options as VirtualOptions } from '../../select/common';
import { transformDate, formatValue, transformWord } from './common';
import { useFilterPicker } from './hooks';

import styles from './index.less';

const { Search } = Input;

const selectFilterValues = arr => arr.map(v => String(v.value));

function FilterSearch({ value, onChange }) {
  return (
    <Search
      placeholder="Input search keyword"
      value={value}
      onChange={onChange}
      className={styles.search}
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
      className={styles.title}
      type="flex"
      justify="space-between"
      align="middle"
    >
      <Col>
        <Icon
          type="iconsort-asc"
          onClick={() => onSort('1')}
          style={{ marginRight: 8 }}
          className={classNames(styles.icon, { [styles.active]: sort === '1' })}
        />
        <Icon
          type="iconsort-desc"
          onClick={() => onSort('0')}
          className={classNames(styles.icon, { [styles.active]: sort === '0' })}
        />
      </Col>
      <Col>
        <span
          aria-hidden="true"
          onClick={onAdvance}
          className={classNames(styles['icon-txt'], {
            [styles.active]: isAdvanceAction,
            [styles.disabled]: loading,
          })}
        >
          <Icon type="iconfilter1" className={styles.icon} />
          <span className={styles.text} role="button">
            {`${transformWord(columnType)} Filter`}
          </span>
        </span>
        <span
          aria-hidden="true"
          onClick={onClear}
          className={classNames(styles['icon-txt'], {
            [styles.disabled]: disabled,
          })}
        >
          <Icon type="icondelete" className={styles.icon} />
          <span className={styles.text}>Clear</span>
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
    <div className={styles.checkbox}>
      <FilterSearch value={searchVal} onChange={handleSeach} />
      <div className={styles.des}>Description</div>
      <Spin spinning={loading}>
        {filterList.length > 0 ? (
          <div className={styles['check-content']}>
            <CheckAll
              checked={isCheckAll}
              indeterminate={indeterminate}
              onChange={handleCheckAll}
              count={filterList.reduce((acc, { count }) => acc + count, 0)}
            />
            {/*
             onChange event can't add  to Checkbox.Group,
             because checked value may lost
            */}
            <Checkbox.Group value={checkedValues.map(({ value: v }) => v)}>
              <VirtualOptions height={160} rowHeight={20}>
                {filterList.map(item => {
                  const { value, count } = item;
                  const strVal = String(value);
                  return (
                    <Checkbox
                      key={strVal}
                      value={value}
                      className="checkbox-item"
                      onChange={handleCheckItem}
                    >
                      <em title={strVal} className="text">
                        {formatValue(columnType, value)}
                      </em>
                      <em className="count">({count})</em>
                    </Checkbox>
                  );
                })}
              </VirtualOptions>
            </Checkbox.Group>
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
    <div className={styles.checkbox}>
      <FilterSearch value={searchVal} onChange={handleSeach} />
      <div className={styles.des}>Description</div>
      <Spin spinning={loading}>
        {filterList.length > 0 ? (
          <div className={styles['check-content']}>
            <CheckAll
              className={styles['check-all']}
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
