// import Vue from 'vue'
// import Vuex from 'vuex'
import { createStore } from 'vuex'
import state from './state';
import mutations from './mutations';
import getters from './getters';
import actions from './actions';

// Vue.use(Vuex)

const store = createStore({
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
})

export default store;
