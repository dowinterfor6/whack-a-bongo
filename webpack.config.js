const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const babelLoader = require('./babelLoader');

module.exports = env => {
  // const isDevelopment = env === "development";
  // console.log(`This is a ${isDevelopment ? "development" : "production"} build`);
  const isDevelopment = env.development;
  console.log(`This is a ${isDevelopment ? "development" : "production"} build`);

  const baseConfig = {
    entry: './scripts/index.js',
    devtool: 'hidden-nosources-source-map',
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'app.bundle.js',
      publicPath: '/dist/'
    },
  };

  if (isDevelopment) {
    return merge(baseConfig, {
      devServer: {
        contentBase: path.resolve(__dirname, 'app'),
        publicPath: '/dist/',
        watchContentBase: false,
        hotOnly: true,
        overlay: true,
        host: "0.0.0.0"
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin()
      ]
    })
  } else {
    return merge(baseConfig, babelLoader)
  }
}