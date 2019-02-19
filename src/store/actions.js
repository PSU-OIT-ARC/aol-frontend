import { L } from 'vue2-leaflet'

// this should be moved to a central place
const LOADING = 'loading';
const BASE_URL = '//localhost:8080';
const MAP_CENTER = [44.72925, -121.0411856];
const BOUNDS_PADDING = 0.30;

const actions = {

    setMapObject (context, map) {
        context.commit('setMap', map);
    },

    searchLakes (context, query) {
        if (query == null || query == '') {
            context.commit('setSearchResults', []);
            return;
        }
        context.commit('setSearchResults', LOADING);
        let results = context.getters.getLakes.filter(lake => {
            return lake.name.toLowerCase().startsWith(query.toLowerCase());
        });
        context.commit('setSearchResults', results);
    },

    fitBounds (context, geom) {
        const map = context.rootState.map_object;
        if (geom === null) {
            map.panTo(MAP_CENTER);
            map.setZoom(8);
            return;
        }
        let bounds = L.latLngBounds(geom);
        // pad the bounds so we don't zoom into too much
        map.fitBounds(bounds.pad(BOUNDS_PADDING));
    },

    fetchLakes (context) {
      fetch(
        `${BASE_URL}/data/lakes.json`
      ).then(
        response => {
          return response.json();
        }
      ).then(
        data => {
          context.commit("setLakes", data)
        }
      ).catch(
        e => {
          console.log(e.message);
      });
    },

    fetchLake (context, slug) {
      fetch(
        `${BASE_URL}/data/lake.json`
      ).then(
        response => {
          return response.json();
        }
      ).then(
        data => {
          context.commit("setCurrentLake", data)
        }
      ).catch(
        e => {
          console.log(e.message);
      });
    },

    setCurrentLake (context, lake) {
        context.commit("setCurrentLake", lake);
    },

}

export default actions;
