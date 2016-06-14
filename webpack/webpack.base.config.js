var webpack = require('webpack')

var path = require('path')
var objectAssign = require('object-assign')

var NODE_ENV = process.env.NODE_ENV

var env = {
  production: NODE_ENV === 'production',
  staging: NODE_ENV === 'staging',
  test: NODE_ENV === 'test',
  development: NODE_ENV === 'development' || typeof NODE_ENV === 'undefined'
}

objectAssign(env, {
  build: (env.production || env.staging)
})

module.exports = {
  target: 'web',
  entry: ['babel-polyfill', './src/script/app.tsx'],
  output: {
    path: path.join(__dirname, '../public/js'),
    publicPath: '/js/',
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.js(x?)$/,
        cacheDirectory: true,
        exclude: [/node_modules/],
        loaders: ['babel']
      },
      {
        test: /\.ts(x?)$/,
        cacheDirectory: true,
        exclude: [/node_modules/],
        loaders: ['babel', 'ts-loader']
      }
      //   {
      //     test: /\.css$/,
      //     loader: "style!css"
      //   }
    ]
  },
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.tsx', '.ts', '.js', '.jsx']
  },
  plugins: [
  ],
  cache: true
}
