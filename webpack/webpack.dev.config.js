var path = require('path')
var webpack = require('webpack')

var config = require('./webpack.base.config.js')

config.cache = true
config.devtool = 'source-map'

config.plugins = config.plugins.concat([
  new webpack.NoErrorsPlugin()
])

module.exports = config
