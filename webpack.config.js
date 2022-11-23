const { resolve } = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/** @type {webpack.Configuration} */
module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  devtool: 'source-map',
  stats: 'minimal',
  output: {
    path: resolve(__dirname, 'build')
  },
  devServer: {
    host: 'localhost',
    port: process.env.PORT || 4000,
    historyApiFallback: true,
    hot: true
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, 'public', 'index.html'),
      favicon: resolve(__dirname, 'public', 'icon.svg')
    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      stream: require.resolve('readable-stream')
    }
  },
  experiments: {
    topLevelAwait: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
        exclude: /node_modules/
      }
    ]
  }
}
