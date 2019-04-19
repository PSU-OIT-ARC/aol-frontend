const path = require('path');

module.exports = {
    css: {
        loaderOptions: {
            sass: {
                data: `@import "@/styles/application.scss";`
            }
        }
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
