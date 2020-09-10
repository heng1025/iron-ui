module.exports = {
  stories: [
    '../stories/**/*.stories.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  // https://storybook.js.org/docs/react/api/writing-presets
  babel: async (config, options) => {
    if (options.configType === 'PRODUCTION') {
      return config;
    }
    const { plugins = [] } = config;
    const libraryName = '../components';
    return {
      ...config,
      // babel-loader property
      // only debugging (override default value)
      // cacheDirectory: false,
      plugins: [
        ...plugins,
        [
          'import',
          {
            libraryName,
            style: true,
            customName: (name) => {
              if (/virtual-(.*)/.test(name)) {
                const validName = name.replace(/virtual-(.*)/, '$1');
                return `${libraryName}/${validName.toLowerCase()}`;
              }
              return `${libraryName}/${name}`;
            },
          },
        ],
      ],
    };
  },
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
