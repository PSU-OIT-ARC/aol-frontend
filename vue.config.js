const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fcl_path = "FlareClusterLayer/fcl/FlareClusterLayer_v4.js";

module.exports = {
    css: {
        loaderOptions: {
            sass: {
                data: `@import "@/styles/application.scss";`
            }
        }
    },
    configureWebpack: {
      plugins: [
        new CopyWebpackPlugin([
            {
              from: path.resolve(__dirname, 'node_modules', fcl_path),
              to:'amd'
            },
        ]),
      ]
    },
    chainWebpack: config => {
        config.module
            .rule('eslint')
            .use('eslint-loader')
            .tap(options => {
                options.configFile = path.resolve(__dirname, ".eslintrc.js");
                return options;
            });
    },
};
