const path = require('path');
// eslint-disable-next-line
const ArcGISPlugin = require("@arcgis/webpack-plugin");

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
            new ArcGISPlugin()
        ],
        node: {
            process: false,
            global: false,
            fs: "empty"
        },
    },
    chainWebpack: config => {
        config.module
            .rule('eslint')
            .use('eslint-loader')
            .tap(options => {
                options.configFile = path.resolve(__dirname, ".eslintrc.js");
                return options;
            });
        //config.resolve.symlinks(false)
    },
};
