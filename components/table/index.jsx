import React, { useState, useContext } from 'react';
import classNames from 'classnames';
import { FilterTitle, useColumnFilter } from './filter';
import {
  TableContext,
  TableContextProvider,
  ColumnContextProvider,
} from './context';

const getwidth = width => String(width).replace(/(\d{1,9})(.*)/g, '$1px');

const TableColumn = ({ column, content }) => {
  return (
    <li
      style={{
        width: getwidth(column.width),
        textAlign: column.align || 'left',
      }}
    >
      {content[column.dataIndex] || column.title}
    </li>
  );
};

const TableRow = ({
  columns,
  className,
  style,
  content = {},
  rowKey,
  isHeader,
}) => {
  const {
    extraParams,
    fetchColData,
    fetchTabData,
    onDataSourceChange,
  } = useContext(TableContext);

  const filterProps = useColumnFilter({
    extraParams,
    fetchColData,
    fetchTabData,
    onDataSourceChange,
  });

  return (
    <ul className={classNames('iron-table-row', className)} style={style}>
      {columns.map(column => {
        const columnProps = {
          column,
          content,
        };
        if (isHeader) {
          return (
            <ColumnContextProvider
              key={column.dataIndex}
              value={{
                curColumn: column.dataIndex,
                ...filterProps,
              }}
            >
              <TableColumn {...columnProps} />
            </ColumnContextProvider>
          );
        }
        return (
          <TableColumn
            {...columnProps}
            key={column[rowKey] || column.key || column.dataIndex}
          />
        );
      })}
    </ul>
  );
};

const Content = ({
  columns,
  dataSource,
  scroll = {},
  rowKey,
  children,
  rowStyle,
}) => {
  return (
    <div
      className="iron-table-content"
      style={{ height: scroll.y, overflowY: scroll.x ? 'unset' : 'auto' }}
    >
      {children}
      {dataSource.map(item => {
        return (
          <TableRow
            columns={columns}
            style={rowStyle}
            content={item}
            rowKey={rowKey}
            key={item.name}
          />
        );
      })}
    </div>
  );
};

const Table = ({
  columns,
  rowKey,
  pageSize,
  dataSource,
  scroll = {},
  extraParams, // search,pagination
  fetchColData,
  fetchTabData,
  onDataSourceChange,
}) => {
  const [list, setList] = useState(dataSource);
  return (
    <TableContextProvider
      value={{
        extraParams,
        fetchColData,
        fetchTabData,
        pageSize,
        onDataSourceChange: ls => {
          if (onDataSourceChange) {
            onDataSourceChange(ls);
          } else {
            setList(ls);
          }
        },
      }}
    >
      <div className="iron-table">
        {scroll.x ? (
          <div style={{ width: scroll.x, height: scroll.y, overflow: 'auto' }}>
            <Content
              columns={columns}
              dataSource={list}
              scroll={scroll}
              rowKey={rowKey}
            >
              <TableRow
                columns={columns}
                className="iron-table-header"
                isHeader
              />
            </Content>
          </div>
        ) : (
          <>
            <TableRow
              columns={columns}
              className="iron-table-header"
              style={{ width: '100%' }}
              isHeader
            />
            <Content
              rowStyle={{ width: '100%' }}
              columns={columns}
              rowKey={rowKey}
              dataSource={list}
              scroll={scroll}
            />
          </>
        )}
      </div>
    </TableContextProvider>
  );
};

export { FilterTitle };
export default Table;
