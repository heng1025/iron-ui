module.exports = {
  stories: [
    '../stories/**/*.stories.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    './style-preset.js',
  ],
  webpackFinal: async (config, options) => {
    // console.log('config', config);
    // change webpack config
    config.module.rules.push({
      test: /\.less$/,
      loaders: ['style-loader', 'css-loader', 'less-loader'],
    });

    return config;
  },
};
