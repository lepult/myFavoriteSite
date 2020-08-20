import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import getBaseConfig from './base-config';

const ROOT_PATH = path.resolve('./');

export default {
    ...getBaseConfig(false),
    devtool: 'hidden-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(ROOT_PATH, 'src/index.html')
        }),
        new webpack.DefinePlugin({
            __DEV__: false,
            __STAGING__: true,
            __LIVE__: false,
        }),
    ]
};
