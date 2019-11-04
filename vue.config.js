const path = require('path');

module.exports = {
    css: {
        loaderOptions: {
            sass: {
                prependData: `@import "@/styles/application.scss";`
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
    pwa: {
        name: "Atlas of Oregon Lakes",
        theme_color: "#4DBA87",
        manifestOptions: {
            short_name: "AOL",
            start_url: "/",
            scope: "/",
            display: "standalone"
        },
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            swSrc: 'src/service-worker.js',
            dontCacheBustURLsMatching: /\.\w{8}\./,
        }
    }
};
