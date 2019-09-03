const PATH = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  
  entry: {
    app: './src/index.js'
  },

  output: {
    path: PATH.resolve(__dirname, 'build'),
    filename: 'app.bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: PATH.resolve(__dirname, 'src/'),
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },

  devServer: {
    contentBase: PATH.resolve(__dirname, 'build'),
  },

  plugins: [
    new CopyWebpackPlugin([
      {
        from: PATH.resolve(__dirname, 'index.html'),
        to: PATH.resolve(__dirname, 'build')
      }
    ]),
    new webpack.DefinePlugin({
      'typeof CANVAS_RENDERER': JSON.stringify(true),
      'typeof WEBGL_RENDERER': JSON.stringify(true)
    })
  ],

  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'all'
    }
  },

  node: {
    fs: "empty"
  }
}