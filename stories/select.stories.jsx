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
  argTypes: {
    placeholder: {
      name: 'placeholder',
      description: 'string',
      control: {
        type: 'text',
      },
    },
    disabled: {
      description: 'boolean',
    },
    allowClear: {
      description: 'boolean',
    },
    showSearch: {
      description: 'boolean',
    },
  },
  args: {
    placeholder: 'please select',
    disabled: false,
    allowClear: false,
    showSearch: false,
  },
};

export const Primary = Template.bind({});

export const Suffix = Template.bind({});
Suffix.args = { suffix: <Icon type="search" /> };

export const Search = Template.bind({});
Search.args = { showSearch: true };

export const Disabled = Template.bind({});
Disabled.args = { disabled: true, value: 'iron' };

export const Clear = Template.bind({});
Clear.args = { allowClear: true };
