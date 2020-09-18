import React from 'react';
import Icon from 'antd/es/icon';
import Input from '../components/input';

export default {
  title: 'components/Input',
  component: Input,
};

export const Primary = (args) => {
  return <Input {...args} placeholder="please input" />;
};

export const Suffix = Primary.bind();
Suffix.args = { suffix: <Icon type="search" /> };

export const Disabled = Primary.bind();
Disabled.args = { disabled: true };
