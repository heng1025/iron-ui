import React from 'react';
import Radio from '../components/radio';

export default {
  title: 'Components/Radio',
  component: Radio,
};

export const Primary = args => {
  return (
    <div>
      <Radio value="1">i am button</Radio>
      <Radio value="2">i am value</Radio>
    </div>
  );
};
