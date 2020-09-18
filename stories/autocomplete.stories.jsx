import React from 'react';
import Icon from 'antd/es/icon';
import VirtualAutoComplete from '../components/auto-complete';

const options = [];
for (let i = 0; i < 10000; i++) {
  const value = `${i.toString(36)}${i}`;
  options.push(value);
}

export default {
  title: 'Components/VirtualAutoComplete',
  // decorators: [
  //   (Story) => (
  //     <div style={{ width: 300 }}>
  //       <Story />
  //     </div>
  //   ),
  // ],
};

// const Template = (args) => (
//   <VirtualAutoComplete {...args}>
//     {options.map((v) => (
//       <div key={v}>{v}</div>
//     ))}
//   </VirtualAutoComplete>
// );

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
