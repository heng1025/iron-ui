## table column filter

### file structure

```hooks.js --- separate state and func
index.jsx --- component entry
index.less --- component style
FilterContent.jsx --- select,checkbox and so on
```

### Get Started

1. import component and hooks

`import ColumnTitle, { actionType,useColumnFilter } from './ColumnTitle';`

2. use component

```js
const { clearFilter, fetchTableList, handlePageChange, getTitleProps } = useColumnFilter({
  dispatch,
  queryList: (params:any)=>void, // query list func
  action: string,
  page: number|string,
  pageSize: number|string,
  reset?: Function,
});

<Table {...porps}>
 <Column
    dataIndex="userName"
    title={
      <ColumnTitle {...getTitleProps('userName')}>
        <FormattedMessage id="alert-center.owner" />
      </ColumnTitle>
    }
  />
</Table>
```

### MODEL (request)

- 'global/fetchTableFilterItems'
- 'global/fetchTableList'
- state

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
  dispatch:Function,
  queryList:Function,
  pageSize:number,
  options = {},
  tableName = string,
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

### How to use with Hoc

```jsx
@withFilterList({ tableName: 'SLOP_BIZ.V_ALERT_CENTER' })
class AlertTable extends React.Component {
  async componentDidMount() {
    const { handleFilterCommit } = this.props;
    handleFilterCommit(column, conditions);
  }
  // ...
}

<AlertTable
  {...this.props}
  pageSize={pageSize} // required
  options={options}
  queryList={queryList}
/>;
```
