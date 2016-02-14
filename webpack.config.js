module.exports = {
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
          'jsx-loader'
        ]
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  }
};
