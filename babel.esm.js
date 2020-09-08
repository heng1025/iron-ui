function transformImportLess2Css() {
  return {
    name: 'transform-import-less-to-css',
    visitor: {
      ImportDeclaration({ node }) {
        const re = /\.less$/;
        if (re.test(node.source.value)) {
          node.source.value = node.source.value.replace(re, '.css');
        }
      },
    },
  };
}

module.exports = function (api) {
  const env = api.env();
  console.log('=====env=====', env);
  api.cache(true);
  // just es/lib required
  const plugins = [transformImportLess2Css];
  const presets = [
    [
      '@babel/preset-env',
      {
        modules: env === 'es' ? false : 'auto',
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
