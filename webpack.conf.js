var path = require('path');

var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test:   /\.js/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/
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
        test: /\.png$/,
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
    modulesDirectories: ['node_modules', 'bower_components']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/index.html',
      inject: 'body'
    })
  ],
  devtool: 'source-map',
  postcss: function () {
    return [autoprefixer];
  }
};
