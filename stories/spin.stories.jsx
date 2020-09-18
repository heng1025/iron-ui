import React from 'react';
import Spin from '../components/spin';

export default {
  title: 'components/Spin',
  component: Spin,
};

export const Primay = (args) => {
  return <Spin {...args}>In progress</Spin>;
};
