import React, { useEffect } from 'react';
import Table, { FilterTitle } from '../components/table';

const columns = [
  { title: 'name', dataIndex: 'name', width: 120 },
  { title: 'course', dataIndex: 'course', width: 140, align: 'center' },
  { title: 'score', dataIndex: 'score', width: 120 },
  { title: 'birth', dataIndex: 'birth', width: 150, type: 'date' },
];

const courses = ['Math', 'English', 'wanniba'];
const birty = ['20180917', '20200815', '20210716', '20200813'];

const dataSource = [];

for (let i = 1, len = 80; i <= len; i++) {
  dataSource.push({
    name: `tiger${i}`,
    course: courses[i % courses.length],
    score: 50 + i,
    birth: birty[i % courses.length],
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

const requestColumnData = ({ column }) => {
  return new Promise((resolve, reject) => {
    if (!column) {
      resolve(dataSource);
    } else if (column === 'birth') {
      resolve([
        { value: '20180917', count: 12 },
        { value: '20200815', count: 12 },
        { value: '20210716', count: 12 },
      ]);
    } else if (column === 'course') {
      reject(new Error('error happen'));
    } else {
      setTimeout(() => {
        resolve(dataSource.map(item => ({ value: item[column], count: '12' })));
      }, 1000);
    }
  });
};

const requestTableData = (params = {}) => {
  console.log('requestTableData -> params', params);
  return new Promise(resolve => {
    if (params.column) {
      resolve(dataSource.filter(item => item.birth === '20180917'));
    } else {
      resolve(dataSource);
    }
  });
};

export const Filter = () => {
  useEffect(() => {
    requestTableData();
  }, []);

  return (
    <Table
      dataSource={dataSource}
      fetchColData={requestColumnData}
      fetchTabData={requestTableData}
      columns={columns.map(column => {
        return {
          ...column,
          title: (
            <FilterTitle columnType={column.type}>{column.title}</FilterTitle>
          ),
        };
      })}
    />
  );
};
