import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
//import { L } from 'vue2-leaflet'
//import 'leaflet/dist/leaflet.css'
import VueLayers from 'vuelayers';


// Vue2-leaflet: resolves an issue where the markers do not appear
//delete L.Icon.Default.prototype._getIconUrl;
/*
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
*/

Vue.config.productionTip = false

Vue.use(VueLayers);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
