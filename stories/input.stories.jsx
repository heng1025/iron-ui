import React from 'react';
import Icon from 'antd/es/icon';
import Input from '../components/input';

export default {
  title: 'components/Input',
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
};

export const Primary = (args) => {
  return <Input {...args} placeholder="please input" />;
};

export const Suffix = Primary.bind();
Suffix.args = { suffix: <Icon type="search" /> };

export const Disabled = Primary.bind();
Disabled.args = { disabled: true };
