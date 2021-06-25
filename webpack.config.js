const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: {
        "index": './server.ts'
    },
    externals: [nodeExternals()],
    target: "node",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new webpack.EnvironmentPlugin(['NODE_ENV'])
    ],
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].bundle.js',
    },
    node: {
        __dirname: true
    }
};