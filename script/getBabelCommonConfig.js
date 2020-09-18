module.exports = function babel(modules) {
  const plugins = ['@babel/plugin-transform-runtime'];
  const presets = [
    [
      '@babel/preset-env',
      {
        modules,
        targets: {
          browsers: [
            'last 2 versions',
            'Firefox ESR',
            '> 1%',
            'ie >= 9',
            'iOS >= 8',
            'Android >= 4',
          ],
        },
      },
    ],
    '@babel/preset-react',
  ];

  return { presets, plugins };
};
