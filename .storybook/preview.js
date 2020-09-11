import React from 'react';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

export const decorators = [
  (Story) => (
    <div style={{ margin: '2em' }}>
      <Story />
    </div>
  ),
];
