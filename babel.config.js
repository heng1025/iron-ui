module.exports = function (api) {
  const env = api.env();
  api.cache(true);
  const presets = [
    [
      '@babel/preset-env',
      {
        modules: env === 'es' ? false : 'cjs',
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

  return { presets };
};
