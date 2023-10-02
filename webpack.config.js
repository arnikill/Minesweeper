const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: {
        main: './src/index.js',
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '@styles': path.resolve(__dirname, 'src/styles'),
            '@': path.resolve(__dirname, 'src')
        }
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    devServer: {
        port: 3000
    },
    plugins: [
        new HTMLWebpackPlugin({
            title: "Webpack development",
            template: './src/index.html'
        }),
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(mp3|wav)$/i,
                loader: 'file-loader',
                options: {
                    name: 'sounds/[name].[ext]',
                    mimetype: 'audio/mpeg'
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};