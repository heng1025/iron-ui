import React from 'react';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

export const decorators = [
  (Story) => (
    <div style={{ width: 300 }}>
      <Story />
    </div>
  ),
];
