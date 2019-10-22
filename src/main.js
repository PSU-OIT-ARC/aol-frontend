import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

import Vue from 'vue'
import VueMeta from 'vue-meta'
import VueAnalytics from 'vue-analytics'
import App from './App.vue'
import router from './router'
import store from './store'


// Enables management of meta tags
Vue.use(VueMeta, {refreshOnceOnNavigation: true});
// Disables console tip regarding running in development mode
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

if (process.env.NODE_ENV === "production") {
  // Initializes sentry/browser
  Sentry.init({
    dsn: process.env.VUE_APP_SENTRY_DSN,
    integrations: [
      new Integrations.Vue({Vue, attachProps: true})
    ]
  });

  console.debug("Installed Sentry integration.");

  // Enables Google Analytics integration
  Vue.use(VueAnalytics, {
    id: 'UA-150299612-1',
    router
  })

  console.debug("Installed GA integration.");
}

// 
import './registerServiceWorker'
