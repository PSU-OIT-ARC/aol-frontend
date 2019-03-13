import * as proj from 'ol/proj';
import * as olExtent from  'ol/extent';

// this should be moved to a central place
const LOADING = 'loading';
const BASE_URL = '//localhost:8080';
const MAP_CENTER = [-121.011856, 43.902925];
const BOUNDS_PADDING = 120;

const actions = {

    setMapObject (context, map) {
        context.commit('setMap', map);
    },

    searchLakes (context, query) {
        let search = {};
        search.query = query;
        search.results = LOADING;

        context.commit('setSearchResults', search);
        if (query == null || query == '') {
            search.results = [];
            context.commit('setSearchResults', search)
            return;
        }
        search.results = context.getters.getLakes.filter(lake => {
            return lake.name.toLowerCase().startsWith(query.toLowerCase());
        });
        context.commit('setSearchResults', search)
    },

    fitBounds (context, options) {

        let geom = options['geom'];
        let buffer = options['buffer'];

        const map = context.rootState.map_object.$map;
        if (geom === null) {
            map.getView().setZoom(8)
            setTimeout(() => {
                map.getView().setCenter(
                    proj.fromLonLat(MAP_CENTER, 'EPSG:3857')
                )
            }, 0);
            return;
        }
        setTimeout(() => {
            map.updateSize();}, 2);
        let transformed_geom = geom.map((coord) => {
            return proj.fromLonLat([coord[1], coord[0]], 'EPSG:3857');
        });
        let bounds = olExtent.boundingExtent(transformed_geom)
        let bounds_buffer = buffer !== undefined ? buffer : BOUNDS_PADDING;
        let padding = Array(4).fill(bounds_buffer);
        let lake_bounds= olExtent.buffer(bounds, bounds_buffer)
        //console.log('viewport: '+ map.getViewport().height)

        setTimeout(() => {
            // possibly just keep zoom the same?
            map.getView().fit(lake_bounds, {padding: padding});
        }, 0);
    },

    fetchLakes (context) {
        return new Promise((resolve, reject) => {
          fetch(
            `${BASE_URL}/data/lakes.json`
          ).then(
            response => {
              return response.json();
            }
          ).then(
            data => {
              context.commit("setLakes", data);
              resolve();
            }
          ).catch(
              e => {
                console.log(e.message);
                reject();
          });
      });
    },

    fetchLake (context, slug) {
      fetch(
        `${BASE_URL}/data/${slug}.json`
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
