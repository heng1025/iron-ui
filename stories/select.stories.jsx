import React, { useState, useEffect } from 'react';
import Icon from '../components/icon';
import VirtualSelect from '../components/select';

const options = [];

for (let i = 0; i < 1000; i++) {
  const value = `${i.toString(36)}${i}`;
  options.push(value);
}

export default {
  title: 'Components/VirtualSelect',
  component: VirtualSelect,
  parameters: {
    actions: {
      handles: ['click .iron-select-option-item'],
    },
  },
  argTypes: {
    children: {
      control: null,
    },
    suffix: {
      control: null,
    },
  },
};

export const Primary = args => (
  <VirtualSelect {...args}>
    {options.map(v => (
      <div key={v}>{v}</div>
    ))}
  </VirtualSelect>
);

export const Suffix = Primary.bind();
Suffix.args = { suffix: <Icon type="search" /> };

export const Search = Primary.bind();
Search.args = { showSearch: true };
// exclude onSearch action
Search.parameters = {
  actions: null,
};

export const Disabled = Primary.bind();
Disabled.args = { disabled: true, value: 'iron' };

export const AllowClear = Primary.bind();
AllowClear.args = { allowClear: true };

export const Loading = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(options);
    }, 5000000);
    return () => clearTimeout(timer);
  }, [options]);

  return (
    <VirtualSelect loading>
      {data.map(v => (
        <div key={v}>{v}</div>
      ))}
    </VirtualSelect>
  );
};
