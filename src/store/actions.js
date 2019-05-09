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
        If the lake object is provided, query feature service for lake geometry
        If the geometry is supplied, goTo geom extent directly.
        Hardcoded zoom level should not be needed when using
        feature layer with lake geometries.
        */
        const ZOOM_LEVEL = 13;
        let lake = options['lake'];
        let buffer = options['buffer'];
        let geom = options['geom'] || undefined;

        const map =  context.rootState.map_object;
        const view = context.rootState.map_view;
        if (geom == undefined) {
            //let lake_layer = map.findLayerById('lake_clusters');
              /*
            // use the cluster graphics layer
            console.log(lake_layer)
            let lake_graphic = lake_layer.data.find((l) => {
                console.log(l)
                return l.attributes.REACHCODE == String(lake.reachcode)
            });
            console.log(lake_graphic)
            geom = lake_graphic.geometry;
          //  console.log(geom)
            view.goTo({center: [geom.x, geom.y], zoom: ZOOM_LEVEL})

            */
            // use the feature service layer
            //let lake_layer = map.findLayerById('lake_points_service_layer');
            let lake_layer = map.findLayerById('lake_bbox_service_layer');
            let query = lake_layer.createQuery();
            query.where = `REACHCODE = ${lake.reachcode}`;
            query.maxRecordCountFactor = 4;
            lake_layer.queryFeatures(query).then((response) => {
                if (response.features.length) {
                    geom = response.features[0].geometry;
                    let extent = geom.extent;
                    if (extent != null) {
                        view.goTo(extent)
                    }
                    else {
                        view.goTo({center: geom, zoom: ZOOM_LEVEL})
                    }
                }
            }).catch((e) => {
                console.log("I am an error: " + e)
            });

        }
        else if (geom != null) {
            console.log('geom' + geom)
            let extent = geom.extent;
            if (extent != null) {
                view.goTo(extent)
            }
            else {
                view.goTo({center: geom, zoom: ZOOM_LEVEL})
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

}

export default actions;
