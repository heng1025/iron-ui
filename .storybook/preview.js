import React from 'react';
// prettier-ignore
const req = require.context('../components', true, /^\.\/[^_][\w-]+\/style\/index\.jsx?$/);
// dynamic import component style
req.keys().forEach(filename => {
  req(filename);
});

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: { expanded: true },
};

export const decorators = [
  Story => (
    <div style={{ mxWidth: 300, minHeight: 200, maxWidth: 600 }}>
      <Story />
    </div>
  ),
];
