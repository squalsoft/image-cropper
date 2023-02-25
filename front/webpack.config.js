// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.(ts|js)?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-typescript"],
                    },
                },
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },

    devServer: {
        static:{ directory: path.join(__dirname, "dist")},
        compress: true,
        port: 4000,
    },
};
