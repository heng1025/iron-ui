import React from 'react';
import { Icon } from 'antd';
import { VirtualSelect } from '../components';

const options = [];
for (let i = 0; i < 100000; i++) {
  const value = `${i.toString(36)}${i}`;
  options.push(value);
}

const Template = (args) => (
  <VirtualSelect {...args}>
    {options.map((v) => (
      <div key={v}>{v}</div>
    ))}
  </VirtualSelect>
);

export default {
  title: 'Components/VirtualSelect',
  component: VirtualSelect,
};

export const Primary = Template.bind({});
Primary.args = {
  placeholder: 'please select',
};

export const Suffix = Template.bind({});
Suffix.args = { ...Primary.args, suffix: <Icon type="search" /> };

export const Search = Template.bind({});
Search.args = { ...Primary.args, showSearch: true };

export const Disabled = Template.bind({});
Disabled.args = { ...Primary.args, disabled: true, value: 'iron' };

export const Clear = Template.bind({});
Clear.args = { ...Primary.args, allowClear: true };
