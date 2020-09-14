module.exports = {
  verbose: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
  // includes deps
  transformIgnorePatterns: [
    'node_modules/(?!(react-virtualized|antd|rc-*|css-animation))',
  ],
  transform: {
    '\\.jsx?$': './script/codePreprocessor',
  },
};
