module.exports = {
  stories: [
    '../stories/**/*.stories.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async (config, options) => {
    // console.log(config);
    config.entry.push('antd/dist/antd.css');
    // change webpack config
    config.module.rules.push({
      test: /\.less$/,
      loaders: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: true,
          },
        },
        {
          loader: 'less-loader',
        },
      ],
    });

    return config;
  },
};
