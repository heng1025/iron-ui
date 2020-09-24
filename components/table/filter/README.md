## table column filter

### file structure

```hooks.js --- separate state and func
index.jsx --- component entry
Widget.jsx --- select,checkbox and so on
```

### Get Started

1. import component and hooks

`import FilterTitle, { useColumnFilter } from 'table';`

2. use component

```js
const { clearFilter, fetchTableList, handlePageChange, getTitleProps } = useColumnFilter({
  request: (column,params:any)=>void, // query list func
  page: number|string,
  pageSize: number|string,
  reset?: Function,
});

<Table {...porps}>
 <Column
    dataIndex="userName"
    title={<FilterTitle {...getTitleProps('name')}>name</FilterTitle>}
  />
</Table>
```

```
{
  filterItems: [],
  filterTables: [],
  filterTableTotal: 0,
  filterTablePage: defaultPage,
  filterTablePageSize: defaultPageSize,
  filterParams: {},
}
```

### API

- type definition

```typescript
enum ConditionType = {
  'EQUAL' = 1,
  'NOT EQUAL',
  'GREATER THAN',
  'GREATER THAN OR EQUAL',
  'LESS THAN',
  'LESS THAN OR EQUAL',
  'CONTAIN',
  'LIKE'
}

// 1. {column: "alertNo",condition: "7",value: ["20200602-00000159", "20200602-00000158"]}
// 2. {column: "tradeDate",condition: "7",value: "20200721"}
// suggestion: many values select 1,or select 2
type Conditions = Array<{ column: string, value: string|string[], condition: ConditionType }>
```

- fetchTableList / fetchSearchTableList

```typescript
type Params = {
  page: string | number;
  pageSize: string | number;
  conditions: Conditions;
  searchConditions: Conditions;
  currentColumn: string;
  sort: '' | '0' | '1';
};

type fetchTableList = {
  (params?: Params, tableName?: string): void;
};
```

- handlePageChange

```typescript
type handlePageChange = {
  (page: string, pageSize: string): void;
};
```

- getTitleProps

```typescript
type ResParams = {
  request: Function;
  curColumn: string;
  searchConditions: Conditions;
  conditions: Conditions;
  tableName: string;
  sort: '' | '0' | '1';
  onCommit: Function;
  onSort: Function;
};
function getTitleProps(column: string): ResParams;
```

- ColumnTitle

```typescript
type ColumnType = 'text' | 'number' | 'date' | 'dateTime' | 'month';

// type=dateTime, only support YYYYMMDDhhmmss format
interface Prop extends ResParams {
  columnType: ColumnType;
}

/**
 * eg: <ColumnTitle columnType="dateTime" {...getTitleProps(`column`)}/>
 * /
```

- hook (useColumnFilter)

```typescript
function useColumnFilter({
  request:Function,
  pageSize:number,
  options = {},
}):{
    conditions:Conditions,
    clearFilter:Function,
    fetchTableList:Function,
    fetchSearchTableList:Function,
    handlePageChange:Function,,
    handleFilterCommit:Function,
    getTitleProps(column:string):ResParams:
  }
```
