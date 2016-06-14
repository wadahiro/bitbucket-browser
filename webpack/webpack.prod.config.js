var path = require('path')
var webpack = require('webpack')

var config = require('./webpack.base.config.js')

config.plugins = config.plugins.concat([
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ output: { comments: false } }),
])

module.exports = config
