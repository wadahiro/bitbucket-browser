var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        vendor: ['babel-polyfill', path.join(__dirname, 'vendors.js')]
    },
    output: {
        path: path.join(__dirname, '../public/js'),
        filename: '[name].js',
        library: '[name]'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, '../dll', '[name]-manifest.json'),
            name: '[name]',
            context: path.resolve(__dirname, 'client')
        }),
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.optimize.OccurenceOrderPlugin(),
        // new webpack.optimize.UglifyJsPlugin()
    ],
    resolve: {
        root: path.resolve(__dirname, 'client'),
        modulesDirectories: ['node_modules']
    }
};
