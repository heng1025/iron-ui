/* eslint-disable import/no-extraneous-dependencies */
// build dist
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
// Attention: https://github.com/webpack-contrib/mini-css-extract-plugin/issues/386
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const getBabelCommonConfig = require('./getBabelCommonConfig');
const { getProjectPath } = require('./utils');

// eslint-disable-next-line import/no-dynamic-require
const pkg = require(getProjectPath('package.json'));

function getWebpackConfig() {
  const babelConfig = getBabelCommonConfig();
  const config = {
    entry: {
      [`${pkg.name}.min`]: [getProjectPath('index')],
    },
    output: {
      path: getProjectPath('dist'),
      filename: '[name].js',
      // https://webpack.js.org/guides/author-libraries/#authoring-a-library
      library: pkg.name,
      libraryTarget: 'umd',
    },
    mode: 'production',
    devtool: 'cheap-source-map',
    // it's important!!!
    externals: {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
      },
    },
    resolve: {
      alias: {
        '@ant-design/icons/lib/dist$': getProjectPath('utils/antdIcon.js'),
      },
      extensions: ['.js', '.jsx'],
    },
    module: {
      noParse: [/moment.js/],
      rules: [
        {
          test: /\.jsx?$/,
          include: [getProjectPath('components')],
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: babelConfig,
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.less$/,
          exclude: /node_modules/,
          use: [
            'style-loader',
            MiniCssExtractPlugin.loader,
            'css-loader',
            'less-loader',
          ],
        },
        // Images
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            minetype: 'image/svg+xml',
          },
        },
        {
          test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      ],
    },
    performance: {
      hints: false,
    },
    plugins: [
      new webpack.BannerPlugin(`${pkg.name} v${pkg.version}`),
      new WebpackBar({
        name: '🚚 iron ui script',
        color: '#3db12f',
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new CssMinimizerPlugin({
        sourceMap: true,
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: '../report.html',
      }),
    ],
  };
  return config;
}

module.exports = getWebpackConfig;
