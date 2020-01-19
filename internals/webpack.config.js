require('dotenv').config()

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoPrefixer = require('autoprefixer')
const DotEnvWebpack = require('dotenv-webpack')
// const WorkboxWebpackPlugin = require('workbox-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = (env, options) => {
  const isDevMode = options.mode === 'development'
  const srcFolder = process.env.SCR_FOLDER

  const config = {
    entry: path.resolve(
      __dirname,
      '..',
      process.env.SCR_FOLDER,
      process.env.WEBPACK_ENTRY_PATH
    ),
    target: 'web',
    output: {
      path: path.join(__dirname, '..', process.env.WEBPACK_BUILD_PATH),
      filename: '[name].bundle.js',
      chunkFilename: 'bundle.[chunkhash].js',
      publicPath: '/'
    },
    devtool: (isDevMode) ? 'inline-source-map' : false,
    resolve: {
      alias: {
        'react-dom': '@hot-loader/react-dom',
        App: path.resolve(__dirname, '..', srcFolder),
        Assets: path.resolve(__dirname, '..', srcFolder, 'assets'),
        Components: path.resolve(__dirname, '..', srcFolder, 'components'),
        Containers: path.resolve(__dirname, '..', srcFolder, 'containers'),
        RootContainers: path.resolve(__dirname, '..', srcFolder, 'rootContainers'),
        Helpers: path.resolve(__dirname, '..', srcFolder, 'helpers')
      }
    },
    plugins: [
      new DotEnvWebpack(),
      new CleanWebpackPlugin(),
      // new CopyWebpackPlugin([
      //   './app/site.webmanifest',
      //   './app/manifest.json',
      //   {
      //     from: './app/assets',
      //     to: 'assets'
      //   }
      // ]),
      new HtmlWebpackPlugin({
        template: path.resolve(srcFolder, 'index.html')
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      })
      // new WorkboxWebpackPlugin.InjectManifest({
      //   swSrc: './app/sw-src.js',
      //   swDest: 'sw.js'
      // })
    ],
    devServer: {
      historyApiFallback: true,
      host: '0.0.0.0',
      port: 3100,
      publicPath: '/',
      writeToDisk: true
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
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            { loader: isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader },
            { loader: 'css-loader' },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [autoPrefixer]
              }
            },
            { loader: 'sass-loader' }
          ]
        },
        {
          test: /\.(ttf|eot|woff|woff2)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]'
            }
          }
        },
        {
          test: /\.(jpe?g|png|gif|svg|ico)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'assets/'
              }
            }
          ]
        }
      ]
    },
    node: {
      fs: 'empty',
      child_process: 'empty'
    }
  }

  /*
  uncomment this if you want to analyze the build sizes of your build file
  if (!isDevMode) {
    config.plugins.push(
      new BundleAnalyzerPlugin()
    )
  }
  */

  return config
}
