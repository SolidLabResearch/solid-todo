const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ProgressPlugin = require("webpack").ProgressPlugin
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

/** @type {import('webpack').Configuration} */
module.exports = {
  module: "development",
  entry: "./src/index.tsx",
  devtool: "inline-source-map",
  output: {
    path: path.resolve(__dirname, "build")
  },
  devServer: {
    host: "localhost",
    port: process.env.PORT || 4000,
    historyApiFallback: true,
    hot: true
  },
  plugins: [
    new ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: "public/index.html",
      favicon: "public/favicon.ico"
    }),
    new NodePolyfillPlugin({
      includeAliases: ["stream", "process"]
    })
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"]
      }
    ]
  }
}
