// build dist
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
// Attention: https://github.com/webpack-contrib/mini-css-extract-plugin/issues/386
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { getProjectPath } = require('./utils');

const pkg = require(getProjectPath('package.json'));

function getWebpackConfig() {
  const config = {
    entry: {
      'iron-ui.min': [getProjectPath('components/index.jsx')],
    },
    output: {
      path: getProjectPath('dist'),
      filename: '[name].js',
      // https://webpack.js.org/guides/author-libraries/#authoring-a-library
      libraryTarget: 'commonjs2',
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
      moment: {
        root: 'moment',
        commonjs2: 'moment',
        commonjs: 'moment',
        amd: 'moment',
      },
    },
    resolve: {
      alias: {
        '@ant-design/icons/lib/dist$': getProjectPath('utils/antdIcon.js'),
      },
      extensions: ['.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: [getProjectPath('components'), getProjectPath('utils')],
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react'],
            },
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
      ],
    },
    performance: {
      hints: false,
    },
    plugins: [
      new webpack.BannerPlugin(`${pkg.name} v${pkg.version}`),
      new WebpackBar({
        name: '🚚 iron ui',
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
