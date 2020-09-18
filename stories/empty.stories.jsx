import React from 'react';
import Empty from '../components/empty';

export default {
  title: 'components/Empty',
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
};

export const Primary = (args) => {
  return <Empty {...args} />;
};

export const Description = Primary.bind();
Description.args = { description: 'ya empty!!!' };

export const NoImage = Primary.bind();
NoImage.args = { image: null };
