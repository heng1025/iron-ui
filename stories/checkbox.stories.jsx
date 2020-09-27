import React from 'react';
import Checkbox from '../components/checkbox';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
};

export const Primary = args => {
  return (
    <Checkbox
      {...args}
      onChange={e => {
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

export const defaultChecked = Primary.bind();
defaultChecked.args = { defaultChecked: true };

export const Checked = Primary.bind();
Checked.args = { checked: true };

export const Disabled = Primary.bind();
Disabled.args = { disabled: true, checked: true };

export const Group = args => {
  return (
    <Checkbox.Group
      {...args}
      value={['3']}
      onChange={e => {
        console.log('selected value', e);
      }}
    >
      <Checkbox value="1">apple</Checkbox>
      <Checkbox value="2">orange</Checkbox>
      <Checkbox value="3">bnana</Checkbox>
      <Checkbox value="4">pear</Checkbox>
      <Checkbox value="5">watermelon</Checkbox>
    </Checkbox.Group>
  );
};

export const GroupGrid = args => {
  return (
    <Checkbox.Group
      value={['3']}
      {...args}
      onChange={e => {
        console.log('selected value', e);
      }}
    >
      <div>
        <Checkbox value="1">apple</Checkbox>
      </div>
      <div>
        <Checkbox value="2">orange</Checkbox>
      </div>
      <div>
        <Checkbox value="3">bnana</Checkbox>
      </div>
      <div>
        <Checkbox value="4">pear</Checkbox>
      </div>
      <div>
        <Checkbox value="5">watermelon</Checkbox>
      </div>
    </Checkbox.Group>
  );
};

export const GroupDisabled = Group.bind();
GroupDisabled.args = { disabled: true };
