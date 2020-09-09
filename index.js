// https://webpack.js.org/guides/dependency-management/#requirecontext
require.context('./components', true, /^\.\/[^_][\w-]+\/style\/index\.jsx?$/);

module.exports = require('./components');
