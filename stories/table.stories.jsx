import React from 'react';
import Table, { FilterTitle, useColumnFilter } from '../components/table';

const columns = [
  { title: 'name', dataIndex: 'name', width: 100 },
  { title: 'course', dataIndex: 'course', width: 140, align: 'center' },
  { title: 'score', dataIndex: 'score', width: 120 },
];

const courses = ['Math', 'English', 'wanniba'];

const dataSource = [];

for (let i = 1, len = 80; i <= len; i++) {
  dataSource.push({
    name: `tiger${i}`,
    course: courses[i % courses.length],
    score: 50 + i,
  });
}

export default {
  title: 'Components/Table',
  component: Table,
};

export const Primary = args => {
  return <Table {...args} columns={columns} dataSource={dataSource} />;
};

export const ScrollY = Primary.bind();
ScrollY.args = { scroll: { y: 200 } };

export const Scroll = Primary.bind();
Scroll.args = { scroll: { x: 120, y: 200 } };

export const Filter = () => {
  const { getTitleProps } = useColumnFilter({
    request: column => {
      console.log('Filter -> column', column);
      return new Promise((resolve, reject) => {
        resolve(dataSource.map(item => ({ value: item[column], count: '12' })));
      });
    },
    page: 1,
    pageSize: 10,
  });
  console.log('Filter -> getTitleProps', getTitleProps);

  return (
    <Table
      dataSource={dataSource}
      columns={columns.map(column => {
        return {
          ...column,
          title: (
            <FilterTitle {...getTitleProps(column.dataIndex)}>
              {column.title}
            </FilterTitle>
          ),
        };
      })}
    />
  );
};
