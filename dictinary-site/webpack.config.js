// path — встроенный в Node.js модуль
const path = require("path")
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require("terser-webpack-plugin"); // minify js
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
//const getFileName = ext => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`
const getFileName = ext => `[name].${ext}`

/** @type {import('webpack').Configuration} */
module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        'main': "./index.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: getFileName('js'),
        clean: true
    },
    optimization: {
        splitChunks: {
            chunks: "all"
        },
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin()
        ]
    },
    devServer: {
        static: './dist',
        open: true,
        port: 4200,
        hot: isDev
    },
    //devtool: isDev ? 'source-map' : false,
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html',
            alwaysWriteToDisk: true,
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CopyWebpackPlugin({
            patterns: [
                // { from: path.resolve(__dirname, 'src/data'), to: 'data' },
                { from: path.resolve(__dirname, 'src/assets'), to: 'assets' }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: getFileName('css')
        }),
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                        },
                    },
                    //MiniCssExtractPlugin.loader,         
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                        },
                    },
                    //MiniCssExtractPlugin.loader,
                    //'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.[png|jpg|svg|jpeg|gif]$/,
                use: [
                    'file-loader',
                ]
            }
        ]
    }
}