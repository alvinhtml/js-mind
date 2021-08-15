const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    index: ['./node_modules/hidpi-canvas/dist/hidpi-canvas.min.js', './app/index.ts'],
    mind: './app/example/mind.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'simple-chart',  // 类库名称
    libraryTarget: 'umd'  // 类库打包方式
  },
  resolve: {
    modules: [path.resolve('node_modules')],
    alias: {
      '~': path.resolve(__dirname, './app')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.css']
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['ts-loader']
      },
      {
        test: /\.(jpg|png|gif|jpeg|bmp|eot|svg|ttf|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 20 * 1024,
            outputPath: './',
          }
        }
      }
    ]
  },
  watch: true,
  watchOptions: {
      poll: 2000, //每秒问我多少次
      aggregateTimeout: 1000, //防抖
      ignored: /node_modules|vendor|build|public|resources/
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './app/index.html',
      chunks: ['index', 'mind'],
      filename: './example/mind.html'
    })
  ],
  devServer: {
    port: 8080,
    progress: true,
    contentBase: './build',
    open: true,
    //hot: true,
    proxy: {
      '/mui/src/css': {
        target: 'http://project.xuehtml.com',
        changeOrigin: true
      }
    },
  }
}
