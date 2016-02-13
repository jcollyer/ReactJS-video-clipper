var Webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: ['./src/main.jsx'],
  output: {
    path: '/build',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loaders: [
        'react-hot', 'jsx-loader'
        ]
      }
    ]
  }
};
