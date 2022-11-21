//
import './registerServiceWorker'

import App from './App.vue'
import router from './router'
import store from './store'

import Vue, { createApp } from 'vue'
import { createMetaManager, plugin as vueMetaPlugin } from 'vue-meta'
import VueGtag from 'vue-gtag'
import * as Sentry from '@sentry/vue';
import { Integrations } from "@sentry/tracing";

// Configure compatibility flags
Vue.configureCompat({
    // In cases where an array object is watched within the current
    // codebase and the 'deep' option is not specified, it is acceptable
    // to utilize the new behavior.
    //
    // Refs: https://v3-migration.vuejs.org/breaking-changes/watch.html
    WATCH_ARRAY: false
})

const app = createApp(App)
app.use(router)
app.use(store)

// Enables management of meta tags
app.use(createMetaManager());
app.use(vueMetaPlugin);

// Initializes sentry/browser
if (process.env.NODE_ENV === "production") {
    Sentry.init({
      dsn: process.env.VUE_APP_SENTRY_DSN,
      integrations: [new Integrations.BrowserTracing()],
      attachStackTrace: true,
      tracesSampleRate: 0.1,
      tracingOptions: {
        trackComponents: true,
      },
    });

    console.debug("Installed Sentry integration.");
}

// Enables Google Analytics integration
if (process.env.NODE_ENV === "production") {
    app.use(
        VueGtag, {
            id: 'UA-150299612-1',
        }
    )

    console.debug("Installed GA integration.");
}

// Mount, finalize app
app.mount('#app')
