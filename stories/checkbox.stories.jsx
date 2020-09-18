import React from 'react';
import Checkbox from '../components/checkbox';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
};

export const Primary = (args) => {
  return (
    <Checkbox
      {...args}
      onChange={(e) => {
        console.log('checked', e.target.checked);
      }}
    >
      123
    </Checkbox>
  );
};

export const Indeterminate = Primary.bind();
Indeterminate.args = {
  indeterminate: true,
};

export const NoChildren = () => {
  return (
    <div>
      <Checkbox />
      <span>123</span>
    </div>
  );
};

export const Checked = Primary.bind();
Checked.args = { checked: true };

export const Disabled = Primary.bind();
Disabled.args = { disabled: true, checked: true };
