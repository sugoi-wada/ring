// webpack.config.js
const path = require("path")
const GasPlugin = require("gas-webpack-plugin")
const ESLintPlugin = require("eslint-webpack-plugin")

module.exports = {
  mode: "development",
  context: __dirname,
  entry: "./src/index.ts",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "index.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  plugins: [new ESLintPlugin(), new GasPlugin()],
  watchOptions: {
    ignored: /node_modules/,
  },
}
