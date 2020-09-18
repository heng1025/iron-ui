import React from 'react';
import Icon from '../components/icon';
import VirtualAutoComplete from '../components/auto-complete';

const options = [];
for (let i = 0; i < 1000; i++) {
  const value = `${i.toString(36)}${i}`;
  options.push(value);
}

export default {
  title: 'Components/VirtualAutoComplete',
  component: VirtualAutoComplete,
};

export const Primary = (args) => (
  <VirtualAutoComplete {...args} placeholder="please input">
    {options.map((v) => (
      <div key={v}>{v}</div>
    ))}
  </VirtualAutoComplete>
);

export const Suffix = Primary.bind({});
Suffix.args = { ...Primary.args, suffix: <Icon type="search" /> };

export const Disabled = Primary.bind({});
Disabled.args = { ...Primary.args, disabled: true, value: 'iron' };
