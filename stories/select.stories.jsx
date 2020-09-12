import React from 'react';
import { Icon } from 'antd';
import { VirtualSelect } from '../components';

export default {
  title: 'Components/VirtualSelect',
  component: VirtualSelect,
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    actions: {
      handles: ['click .iron-select-option-item'],
    },
  },
};

const options = [];

for (let i = 0; i < 100000; i++) {
  const value = `${i.toString(36)}${i}`;
  options.push(value);
}

export const Primary = (args) => (
  <VirtualSelect {...args}>
    {options.map((v) => (
      <div key={v}>{v}</div>
    ))}
  </VirtualSelect>
);

export const Suffix = Primary.bind();
Suffix.args = { suffix: <Icon type="search" /> };

export const Search = Primary.bind();
Search.args = { showSearch: true };

export const Disabled = Primary.bind();
Disabled.args = { disabled: true, value: 'iron' };

export const Clear = Primary.bind();
Clear.args = { allowClear: true };
