const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    //mode: 'development',
    mode: 'production',
    entry: ['@babel/polyfill', './src/index.js'],
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'main.js'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebPackPlugin({
            template: path.resolve(__dirname, './src/template.html'),
            filename: 'index.html',
        }),
        //new CopyPlugin(
        //{
        //patterns: [{ from: './src/img', to: './img' }],
        //}),		
    ],
    module: {
        rules: [{
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset',
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline',
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ],
    },
    resolve: {
        extensions: ['.js'],
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                node_modules: {
                    filename: 'commons.js',
                },
            },
        }
    },
    devServer: {
        port: 3100,
    }
};