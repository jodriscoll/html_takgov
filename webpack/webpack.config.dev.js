const Path = require('path');
const fs = require('fs');
const Webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common.js');

// eslint-disable-next-line no-sync
const htmlFiles = fs.readdirSync(Path.resolve(__dirname, '../src/html'));

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-eval-source-map',
  devServer: {
    inline: true,
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    ...htmlFiles.map(
      (htmlFile) =>
        new HtmlWebpackPlugin({
          filename: htmlFile,
          template: Path.resolve(__dirname, '../src/html', htmlFile),
          inject: false,
        })
    ),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: Path.resolve(__dirname, '../src'),
        exclude: /bootstrap/,
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
        },
      },
      {
        test: /\.js$/,
        include: Path.resolve(__dirname, '../src'),
        loader: 'babel-loader',
      },
    ],
  },
});
