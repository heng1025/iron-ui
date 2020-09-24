import React from 'react';
import Table from '../components/table';

const columns = [
  { title: 'name', dataIndex: 'name', width: '50px' },
  { title: 'course', dataIndex: 'course', width: 100, align: 'center' },
  { title: 'score', dataIndex: 'score', width: 80 },
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
