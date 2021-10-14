const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    index: ['./node_modules/hidpi-canvas/dist/hidpi-canvas.min.js', './app/index.ts'],
    mind: './app/example/mind.ts',
    tree: './app/example/tree.ts'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'simple-chart', // 类库名称
    libraryTarget: 'umd' // 类库打包方式
  },
  resolve: {
    modules: [path.resolve('node_modules')],
    alias: {
      '~': path.resolve(__dirname, './app')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.css']
  },
  module: {
    rules: [{
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['ts-loader']
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(jpg|png|gif|jpeg|bmp|eot|svg|ttf|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 200 * 1024,
            // outputPath: './',
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
      chunks: ['index'],
      filename: './index.html'
    }),
    new HtmlWebpackPlugin({
      template: './app/index.html',
      chunks: ['index', 'mind'],
      filename: './example/mind.html'
    }),
    new HtmlWebpackPlugin({
      template: './app/index.html',
      chunks: ['index', 'tree'],
      filename: './example/tree.html'
    })
  ],
  devServer: {
    port: 8086,
    client: {
      progress: true,
    },
    onBeforeSetupMiddleware: function(devServer) {
      devServer.app.get('/', function (req, res) {
        res.redirect('example/mind.html')
      });
    },
    open: true,
    hot: true
  }
}
