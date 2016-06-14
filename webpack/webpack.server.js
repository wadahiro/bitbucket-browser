var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var config = require('./webpack.config')

config.entry.unshift('webpack/hot/only-dev-server')
config.entry.unshift('webpack-dev-server/client?http://localhost:9000')

// config.module.loaders = config.module.loaders.map(function (loader) {
//   loader.loaders.unshift('react-hot')
//   return loader
// })

config.plugins.unshift(new webpack.HotModuleReplacementPlugin())

new WebpackDevServer(webpack(config), {
  publicPath: 'http://localhost:9000' + config.output.publicPath,
  contentBase: __dirname + '/../public',
  hot: true,
  inline: true,
  stats: { colors: true },
  proxy: {
    '/bitbucket/*': 'http://localhost:3000',
    '/stash/*': 'http://localhost:3000',
    '/sonar/*': 'http://localhost:3000',
    '/node_modules/*': 'http://localhost:3000'
  }
}).listen(9000, 'localhost', function (err, result) {
  if (err) {
    console.log(err)
  }

  console.log('Listening at localhost:9000')
})
