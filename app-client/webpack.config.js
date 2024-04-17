var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: [
        'babel-polyfill',
        path.join(__dirname, 'src/index.js'),
        path.join(__dirname, 'src/style.css')
    ],

    output: {
        path: path.join(__dirname, '../public/assets/js'),
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel?' + JSON.stringify({
                    cacheDirectory: true,
                    presets: ['es2015', 'react']
                })],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                loader: 'style!css-loader'
            }
        ]
    },

    resolve: {
        root: path.resolve(path.join(__dirname, 'src'))
    },

    plugins:[
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress:{
                warnings: true
            }
        })
    ]

};