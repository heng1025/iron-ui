// https://webpack.js.org/guides/dependency-management/#requirecontext
// eg: ./select/style/index.jsx
require.context('./components', true, /^\.\/[^_][\w-]+\/style\/index\.jsx?$/);

module.exports = require('./components');
