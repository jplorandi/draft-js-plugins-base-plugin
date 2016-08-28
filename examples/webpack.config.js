var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require('path');

var libraryName = 'ExampleEditor';

var plugins = [new HtmlWebpackPlugin()], outputFile;

outputFile = libraryName + '.js';

var config = {
  entry: ['babel-polyfill', __dirname + '/src/index.js'],
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  cssx: {
    minify: false
  },
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      },
      {
        test: /(\.css)$/,
        loader: 'style-loader!css-loader!postcss-loader'
      },
      {
        test: /(\.less)$/,
        loader: 'style-loader!css-loader!postcss-loader!less-loader'
      },
      {
        test: /(\.js)$/,
        loader: 'cssx-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js']
  },
  plugins: plugins,

};



module.exports = config;
