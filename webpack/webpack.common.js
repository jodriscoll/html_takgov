const Path = require('path');
const Webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    'js/index': Path.resolve(__dirname, '../src/js/index.js'),
    'css/index': Path.resolve(__dirname, '../src/scss/index.scss'),
  },
  output: {
    path: Path.join(__dirname, '../dist'),
    filename: '[name].min.js',
  },
  plugins: [
    new Webpack.ProvidePlugin({
      // name : 'name',
    }),
    new CopyWebpackPlugin([
      { from: Path.resolve(__dirname, '../src/img'), to: 'img' },
      { from: Path.resolve(__dirname, '../src/fonts'), to: 'fonts' },
      { from: Path.resolve(__dirname, '../src/files'), to: 'files' },
      { from: Path.resolve(__dirname, '../src/media'), to: 'media' },
      { from: Path.resolve(__dirname, '../src/html'), to: '.' },
    ]),
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].min.css',
    }),
  ],
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        },
      },
      {
        test: /\.s?css/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
};
