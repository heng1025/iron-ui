// jest config (jest --no-cache when debugger)
const { createTransformer } = require('babel-jest');
const getBabelCommonConfig = require('./getBabelCommonConfig');

module.exports = {
  process(src, path, config, transformOptions) {
    const babelConfig = getBabelCommonConfig();
    const babelJest = createTransformer(babelConfig);
    const babelSupport =
      path.endsWith('.js') ||
      path.endsWith('.jsx') ||
      path.endsWith('.ts') ||
      path.endsWith('.tsx');

    const fileName = babelSupport ? path : 'file.js';
    // console.log('process -> fileName', fileName);
    return babelJest.process(src, fileName, config, transformOptions);
  },
};
