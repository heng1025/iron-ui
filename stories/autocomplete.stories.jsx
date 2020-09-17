import React from 'react';
import Icon from 'antd/es/icon';
import VirtualAutoComplete from '../components/auto-complete';

const options = [];
for (let i = 0; i < 100000; i++) {
  const value = `${i.toString(36)}${i}`;
  options.push(value);
}

const Template = (args) => (
  <VirtualAutoComplete {...args}>
    {options.map((v) => (
      <div key={v}>{v}</div>
    ))}
  </VirtualAutoComplete>
);

export default {
  title: 'Components/VirtualAutoComplete',
  component: VirtualAutoComplete,
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
};

export const Primary = Template.bind({});
Primary.args = {
  placeholder: 'please input',
};

export const Suffix = Template.bind({});
Suffix.args = { ...Primary.args, suffix: <Icon type="search" /> };

export const Disabled = Template.bind({});
Disabled.args = { ...Primary.args, disabled: true, value: 'iron' };
