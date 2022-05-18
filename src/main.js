//
import './registerServiceWorker'

import App from './App.vue'
import router from './router'
import store from './store'

import { createApp } from 'vue'
import { createMetaManager, plugin as vueMetaPlugin } from 'vue-meta'
import VueGtag from 'vue-gtag'
import * as Sentry from '@sentry/vue';
import { Integrations } from "@sentry/tracing";


const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')


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
