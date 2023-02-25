const path = require('path');
const nodeExternals = require('webpack-node-externals');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

const {
    NODE_ENV = 'production',
} = process.env;

module.exports = {
    watch: NODE_ENV === 'development',
    entry: './src/index.ts',
    mode: NODE_ENV,
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    'ts-loader',
                ]
            }
        ]
    },
    externals: [ nodeExternals() ],
    plugins: [
        new WebpackShellPluginNext({
            onBuildEnd:{
                scripts: ['npm run run:dev'],
                blocking: false,
                parallel: true
            }
        })
    ]
}