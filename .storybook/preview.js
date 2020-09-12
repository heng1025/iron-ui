import React from 'react';
// prettier-ignore
const req = require.context('../components', true, /^\.\/[^_][\w-]+\/style\/index\.jsx?$/);
// dynamic import component style
req.keys().forEach((filename) => {
  req(filename);
});

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

export const decorators = [
  (Story) => (
    <div style={{ minHeight: 200 }}>
      <Story />
    </div>
  ),
];
