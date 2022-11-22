const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

/** @type {webpack.Configuration} */
module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  devtool: 'source-map',
  stats: 'minimal',
  output: {
    path: path.resolve(__dirname, 'build')
  },
  devServer: {
    host: 'localhost',
    port: process.env.PORT || 4000,
    historyApiFallback: true
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/favicon.ico'
    }),
    new NodePolyfillPlugin()
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
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  }
}
