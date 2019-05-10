import config from '@/components/map/config';

// this should be moved to a central place
const LOADING = 'loading';
const BASE_URL = '//localhost:8080';

const actions = {

    setMapObject (context, map) {
        context.commit('setMap', map);
    },

    setMapNode (context, node) {
        context.commit('setMapNode', node);
    },

    setMapView (context, view) {
        context.commit('setMapView', view);
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
        /*
        Zoom/pan to lake bounds.
        If the geometry is supplied, goTo geom extent directly.
        If the lake object is provided, and it has a geom attribute, goTo it
        Otherwise, query feature service for lake geometry using reachcode.
        */
        const map =  context.rootState.map_object;
        const view = context.rootState.map_view;

        let lake = options['lake'];
        let buffer = options['buffer'];
        let geom = options['geom'] || undefined;

        if (lake) {
          geom = lake.geom || geom;
        }

        if (geom == undefined) {
            let lake_layer = map.findLayerById('lake_bbox_service_layer');
            let query = lake_layer.createQuery();
            query.where = `REACHCODE = ${lake.reachcode}`;
            query.maxRecordCountFactor = 4;
            lake_layer.queryFeatures(query).then((response) => {
                if (response.features.length) {
                    geom = response.features[0].geometry;
                    lake.geom = geom;
                    let extent = geom.extent;
                    if (extent != null) {
                        view.goTo(extent).then(()=>{
                            context.dispatch('setLoading', false)
                        })
                    }
                }
            }).catch((e) => {
                console.log("I am an error: " + e)
            });

        }
        else if (geom != null) {
            let extent = geom.extent;
            if (extent != null) {
                view.goTo(extent).then(()=>{
                    context.dispatch('setLoading', false)
                })
            }
        }
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

    setLoading (context, is_loading) {
        context.commit("setLoading", is_loading);
    }
}

export default actions;
