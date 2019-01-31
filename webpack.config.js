const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const mode = process.env.NODE_ENV

module.exports = {
  mode,
  entry: [
    'react-hot-loader/patch',
    path.join(__dirname, './src/main.js'),
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
  },
  context: __dirname,
  resolve: {
    extensions: ['.jsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: 'css-loader',
      },
      {
        test: /\.less/,
        use: ['style-loader', 'css-loader', {
          loader: 'postcss-loader',
          options: {
            plugins: [require('autoprefixer')({
              browsers: [
                'Android > 4',
                'iOS > 8'
              ]
            })]
          }
        }, 'less-loader'],
      },
    ],
  },
  plugins: [
    new htmlWebpackPlugin({
      template: 'index.html',
      hash: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    historyApiFallback: true,
    inline: true,
    open: false,
    compress: true,
    port: 8080,
    hot: true,
  },
}
