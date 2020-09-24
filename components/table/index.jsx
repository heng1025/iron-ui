import React from 'react';
import classNames from 'classnames';
export { FilterTitle, useColumnFilter } from './filter';

const getWidth = width => String(width).replace(/(\d{1,9})(.*)/g, '$1px');

const TableRow = ({ columns, className, style, content = {} }) => {
  return (
    <ul className={classNames('iron-table-row', className)} style={style}>
      {columns.map(column => {
        return (
          <li
            key={column.key || column.dataIndex}
            style={{
              width: getWidth(column.width),
              textAlign: column.align || 'left',
            }}
          >
            {content[column.dataIndex] || column.title}
          </li>
        );
      })}
    </ul>
  );
};

const Content = ({
  columns,
  dataSource,
  scrollY = 'auto',
  children,
  rowStyle,
}) => {
  return (
    <div
      className="iron-table-content"
      style={{ height: scrollY, overflowY: 'auto' }}
    >
      {children}
      {dataSource.map(item => {
        return (
          <TableRow
            columns={columns}
            style={rowStyle}
            content={item}
            rowKey={item.name}
            key={item.name}
          />
        );
      })}
    </div>
  );
};

const Table = ({ columns, dataSource, scroll = {} }) => {
  return (
    <div className="iron-table">
      {scroll.x ? (
        <div style={{ width: scroll.x, height: scroll.y, overflow: 'auto' }}>
          <Content columns={columns} dataSource={dataSource} scrollY={scroll.y}>
            <TableRow columns={columns} className="iron-table-header" />
          </Content>
        </div>
      ) : (
        <>
          <TableRow
            columns={columns}
            className="iron-table-header"
            style={{ width: '100%' }}
          />
          <Content
            rowStyle={{ width: '100%' }}
            columns={columns}
            dataSource={dataSource}
            scrollY={scroll.y || 'auto'}
          />
        </>
      )}
    </div>
  );
};

export default Table;
