import * as Sentry from '@sentry/browser';

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './registerServiceWorker'

// Disables console tip regarding running in development mode
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


if (process.env.VUE_APP_NODE_ENV === "production") {
  // Initializes sentry/browser
  Sentry.init({
    dsn: process.env.VUE_APP_SENTRY_DSN,
    integrations: [new Sentry.Integrations.Vue()]
  });

  console.info("Installed Sentry integration.");
}
