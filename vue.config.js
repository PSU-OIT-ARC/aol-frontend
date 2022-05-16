const path = require('path');

module.exports = {
    chainWebpack: (config) => {
        config.resolve.alias.set('vue', '@vue/compat')

        config.module
            .rule('vue')
            .use('vue-loader')
            .tap((options) => {
                return {
                    ...options,
                    compilerOptions: {
                        compatConfig: {
                            MODE: 2
                        }
                    }
                }
            })
    },
    css: {
        loaderOptions: {
            sass: {
                additionalData: `@import "@/styles/application.scss";`
            }
        }
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
            swSrc: './src/service-worker.js',
            dontCacheBustURLsMatching: /\.\w{8}\./,
        }
    }
};
