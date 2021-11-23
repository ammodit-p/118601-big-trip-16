const path = require('path')

module.exports = (mode) => {
  return {
    mode,
    entry: './src/main.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'public')
    },
    devtool: 'source-map',
    devServer: {
      port: 3000,
      hot: false
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
      ]
    }
  }
}
