const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: "development",
    entry: path.resolve(__dirname,"src","js","main.js"),
    output: {
        filename: "[name].[chunkhash].js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new htmlWebpackPlugin ({
            template: "./src/index.html",
        }),
    ],
    devServer: {
        port: 5500,
    },
}