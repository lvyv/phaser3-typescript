const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: './src/game.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.png/,
        type: 'asset/resource'
      },
      {
        test: /\.ts$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'ts-loader'
      },
      {
        test: require.resolve('phaser'),
        loader: 'expose-loader',
        options: { exposes: { globalName: 'Phaser', override: true } }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  devServer: {
    static: path.resolve(__dirname, './dist'),
    host: 'localhost',
    port: 8080,
    open: false,
    hot: true
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "assets/",
          to: "assets/",
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'),
      inject: 'head'
    })
  ]
};
