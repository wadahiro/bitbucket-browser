var path = require('path')
var webpack = require('webpack')

var config = require('./webpack.base.config.js')

config.debug = true
config.profile = false
config.devtool = 'inline-source-map'

config.plugins = config.plugins.concat([
//   new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
])

module.exports = config
