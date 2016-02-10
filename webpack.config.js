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
      }, {
        test: /\.less$/, loader: 'style-loader!css-loader!less-loader'
      }, {
        test: /\.svg/,
        loader: 'url-loader?limit=10000&minetype=image/svg+xml'
      }, {
        test: /\.eot/,
        loader: 'url-loader?limit=10000&minetype=application/vnd.ms-fontobject'
      }, {
        test: /\.ttf|otf/,
        loader: 'url-loader?limit=10000&minetype=application/font-sfnt'
      }, {
        test: /\.woff/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      }, {
        test: /\.gif/,
        loader: 'url-loader?limit=10000&minetype=image/gif'
      }, {
        test: /\.jpg/,
        loader: 'url-loader?limit=10000&minetype=image/jpg'
      }, {
        test: /\.png/,
        loader: 'url-loader?limit=10000&minetype=image/png'
    }]
  },
  plugins: [new Webpack.HotModuleReplacementPlugin()]
};
