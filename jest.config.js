module.exports = {
  verbose: true,
  // includes deps
  transformIgnorePatterns: ['node_modules/(?!(react-virtualized|antd|rc-*|css-animation))'],
  transform: {
    '\\.jsx?$': './script/codePreprocessor',
  },
};
