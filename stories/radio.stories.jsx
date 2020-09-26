import React from 'react';
import Radio from '../components/radio';

export default {
  title: 'Components/Radio',
  component: Radio,
};

export const Primary = args => {
  return (
    <Radio value="1" {...args}>
      i am button
    </Radio>
  );
};

export const Checked = Primary.bind();
Checked.args = { checked: true };

export const DefaultChecked = Primary.bind();
DefaultChecked.args = { defaultChecked: true };

export const Disabled = Primary.bind();
Disabled.args = { disabled: true };

export const DisabledChecked = Primary.bind();
DisabledChecked.args = { disabled: true, checked: true };

export const Group = () => {
  return (
    <Radio.Group defaultValue="2">
      <Radio value="1">apple</Radio>
      <Radio value="2">orange</Radio>
      <Radio value="3">bnana</Radio>
      <Radio value="4">pear</Radio>
      <Radio value="5">watermelon</Radio>
    </Radio.Group>
  );
};
