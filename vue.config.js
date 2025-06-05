const path = require('path')
const resolve = dir => {
  return path.join(__dirname, dir)
}
// const CopyWebpackPlugin = require("copy-webpack-plugin")
// const { SocksProxyAgent } = require("socks-proxy-agent")
// const agent = new SocksProxyAgent("socks://127.0.0.1:1086")
const CompressionPlugin = require('compression-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
module.exports = {
  lintOnSave: false,
  publicPath: './',
  devServer: {
    host: '0.0.0.0',
    port: 9527,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_PREFIX_URL,
        changeOrigin: true,
        secure: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  },

  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_c', resolve('src/components'))
    config.plugin('html').tap(args => {
      args[0].title = 'OLE LIVE'
      return args
    })
  },
  configureWebpack: () => {
    let list = [new CopyPlugin([{ from: 'public/tcplayer', to: 'tcplayer' }])]
    if (process.env.NODE_ENV === 'production') {
      list.push(
        new CompressionPlugin({
          algorithm: 'gzip',
          test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
          filename: '[path][base].gz',
          minRatio: 0.8,
          threshold: 10240,
          deleteOriginalAssets: false
        })
      )
    }
    return {
      output: {
        filename: 'js/[name].js?hash=[hash]',
        chunkFilename: 'js/[id].js?hash=[hash]'
      },
      plugins: list
    }
  },
  productionSourceMap: false,

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'sass',
      patterns: [path.resolve(__dirname, 'src/style/global.sass')]
    },
    windicss: {}
  },

  transpileDependencies: ['vuetify']
}
