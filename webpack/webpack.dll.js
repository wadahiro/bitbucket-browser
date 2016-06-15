var path = require('path');
var webpack = require('webpack');

var NODE_ENV = process.env.NODE_ENV;
NODE_ENV = NODE_ENV && NODE_ENV.trim() === 'production' ? 'production' : 'development';
console.log('NODE_ENV: ' + NODE_ENV);

var config = {
    entry: {
        vendor: ['babel-polyfill', path.join(__dirname, 'vendors.js')]
    },
    output: {
        path: path.join(__dirname, '../public/js'),
        filename: '[name].js',
        library: '[name]'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"' + NODE_ENV + '"'
        }),
        new webpack.DllPlugin({
            path: path.join(__dirname, '../dll', '[name]-manifest.json'),
            name: '[name]',
            context: path.resolve(__dirname, 'client')
        }),
        // new webpack.optimize.OccurenceOrderPlugin(),
        // new webpack.optimize.UglifyJsPlugin()
    ],
    resolve: {
        root: path.resolve(__dirname, 'client'),
        modulesDirectories: ['node_modules']
    }
};

if (NODE_ENV === 'production') {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        output: {
            comments: false
        }
    }))
}

module.exports = config;