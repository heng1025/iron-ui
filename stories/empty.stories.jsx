import React from 'react';
import Empty from '../components/empty';

export default {
  title: 'components/Empty',
  // component: Empty,
};

export const Primary = (args) => {
  return <Empty {...args} />;
};

export const Description = Primary.bind();
Description.args = { description: 'ya empty!!!' };

export const NoImage = Primary.bind();
NoImage.args = { image: null };
