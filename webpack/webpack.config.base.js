const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const HappyPack = require('happypack');

module.exports = options => ({
  context: options.context,
  entry: options.entry,
  output: Object.assign({
    path: path.join(options.root, 'server', 'public', 'site-build'),
    publicPath: '/site-build/'
  }, options.output),
  resolve: {
    modules: [
      path.resolve('./src/'),
      'node_modules'
    ],
    extensions: ['.js']
  },
  // node: {
  //   console: false,
  //   fs: 'empty',
  //   net: 'empty',
  //   tls: 'empty'
  // },  
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'happypack/loader',
        }],
      },
      {
        test: /\.css$/,
        exclude: [/node_modules/, /\/src\/client\/assets\/styles\/bootstrap/],
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoader: '1',
              modules: true,
              localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        include: [/node_modules/, /\/src\/client\/assets\/styles\/bootstrap/],
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpe?g)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: '8192'
          }
        }]
      },
      {
        test: /\.(eot|ttf|svg|gif|woff2?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: options.plugins.concat([
    new AssetsPlugin({
      filename: 'assets.json',
      path: path.join(options.root, 'server', 'public', 'site-build'),
      prettyPrint: true,
      update: true
    }),
    new webpack.NamedModulesPlugin(),
    new HappyPack({
      loaders: [{
        loader: 'babel-loader',
        query: {
          presets: [
            ['es2015', { modules: false }],
            'es2016',
            'react'
          ],
          plugins: [
            'react-hot-loader/babel',
            'transform-object-assign',
            'transform-object-rest-spread',
            'transform-export-extensions',
            'transform-class-properties'
          ]
        }
      }],
      threads: 4
    })
  ]),
  devtool: options.devtool,
  devServer: options.devServer,
  target: 'web',
  performance: options.performance || {}
});
