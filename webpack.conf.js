'use strict'

const _ = require('lodash');
const path = require('path');

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const NgAnnotateWebpackPlugin = require('ng-annotate-webpack-plugin');

const common = {
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test:   /\.js/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          "presets": ["es2015"],
          "plugins": ["add-module-exports"]
        }
      },
      {
        test:   /\.scss/,
        loaders: ['style', 'css', 'postcss', 'sass?sourceMap']
      },
      {
        test:   /\.css/,
        loaders: ['style', 'css', 'postcss']
      },
      {
        test:   /\.html/,
        loader: 'html'
      },
      {
        test: /\.(png|jpg)$/,
        loader: "file-loader"
      },
      { test: /\.woff(\?.*$|$)/,              loader: "url-loader?limit=10000&mimetype=font/woff" },
      { test: /\.woff2(\?.*$|$)/,             loader: "url-loader?limit=10000&mimetype=font/woff2" },
      { test: /\.(ttf|eot|svg)(\?.*$|$)$/,    loader: "file-loader" }
    ]
  },
  resolve: {
    root: [
      path.resolve('./client')
    ],
    modulesDirectories: ['node_modules']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/index.html',
      inject: 'body'
    })
  ],
  postcss: function () {
    return [autoprefixer];
  },
  externals: {
    "mathjax": "MathJax"
  }
};

const development = _.defaults({ devtool: 'source-map '}, common);
const test = _.defaults({ devtool: 'inline-source-map '}, common);
const production = _.defaults({}, common);
production.plugins = common.plugins.concat([
    new CopyWebpackPlugin([{ from: './client/favicon.ico' }, { from: './client/robots.txt' }]),
    new NgAnnotateWebpackPlugin(),
    new webpack.optimize.UglifyJsPlugin()
]);

module.exports = { development, test, production };