const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');
const entries = require('./entries');

const bundleProcess = [
  'react-hot-loader/patch',
  'webpack-dev-server/client?http://localhost:8003/',
  'webpack/hot/only-dev-server',
];

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('development')
    }
  }),
];

module.exports = baseConfig({
  context: path.resolve(process.cwd(), 'src'),
  root: path.resolve(process.cwd(), 'src'),
  entry: Object.entries(entries).reduce((acc, val) => Object.assign(acc, {
    [val[0]]: bundleProcess.concat(val[1])
  }), {}),
  output: {
    filename: '[name].js'
  },
  plugins,
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    port: 8003,
    hot: true,
    contentBase: '/site-build/',
    publicPath: '/site-build/',
    proxy: {
      '*': 'http://localhost:3000'
    }
  },
  performance: {
    hints: false
  }
});
