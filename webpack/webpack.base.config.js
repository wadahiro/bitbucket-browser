var webpack = require('webpack')
var HappyPack = require('happypack');

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
        test: /\.ts(x?)$/,
        include: [
          path.join(__dirname, '../src/script') //important for performance!
        ],
        loaders: ['react-hot', 'babel?cacheDirectory=true', 'awesome-typescript-loader?useBabel=true&babelOptions=true&forkChecker=true'],
        // loaders: ['happypack/loader', 'awesome-typescript-loader?useBabel=true&babelOptions=true&forkChecker=true']
      }
      //   {
      //     test: /\.css$/,
      //     loader: 'style!css'
      //   }
    ]
  },
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.tsx', '.ts', '.js', '.jsx']
  },
  plugins: [
    //Typically you'd have plenty of other plugins here as well
    new webpack.DllReferencePlugin({
      context: path.join(__dirname, '../src/script'),
      manifest: require('../dll/vendor-manifest.json')
    }),
    // I'm waiting the issue...
    // https://github.com/amireh/happypack/issues/33
    // new HappyPack({
    //   // loaders is the only required parameter:
    //   loaders: ['react-hot', 'babel'],

    //   // customize as needed, see Configuration below
    // })
  ],
  cache: true
}
