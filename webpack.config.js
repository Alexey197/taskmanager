const path = require(`path`)
const MomentLocalesPlugin = require(`moment-locales-webpack-plugin`)

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    clean: true
  },
  devtool: 'source-map',
  devServer: {
    port: 3000
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new MomentLocalesPlugin()
  ]
}
