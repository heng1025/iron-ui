import React from 'react';
import Radio from '../components/radio';

export default {
  title: 'Components/Radio',
  component: Radio,
};

export const Primary = args => {
  return <Radio {...args}>i am button</Radio>;
};

export const Checked = Primary.bind();
Checked.args = { checked: true };

export const DefaultChecked = Primary.bind();
DefaultChecked.args = { defaultChecked: true };

export const Disabled = Primary.bind();
Disabled.args = { disabled: true };

export const DisabledChecked = Primary.bind();
DisabledChecked.args = { disabled: true, checked: true };

export const Group = args => {
  return (
    <Radio.Group
      defaultValue="2"
      {...args}
      onChange={e => {
        console.log('selected value', e.target.value);
      }}
    >
      <Radio value="1">apple</Radio>
      <Radio value="2">orange</Radio>
      <Radio value="3">bnana</Radio>
      <Radio value="4">pear</Radio>
      <Radio value="5">watermelon</Radio>
    </Radio.Group>
  );
};

export const GroupDisabled = Group.bind();
GroupDisabled.args = { disabled: true };
