import config from '@/components/map/config';

const API_URL = config.backend_url;
const actions = {

    getAuthToken (context) {
        return fetch(`${API_URL}/token/?format=json`).then(response => {
            return response.json();
        });
    },

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
        search.results = config.LOADING;
        search.all_results = [];

        context.commit('setSearchResults', search);
        if (query == null || query == '') {
            search.results = [];
            context.commit('setSearchResults', search)
            return;
        }

        search.results = context.getters.getLakes.filter(lake => {
            return lake.title.toLowerCase().includes(query.toLowerCase());
        });
        if (search.results.length > config.max_search_results) {
            search.all_results = search.results;
            let results = context.getters.getLakes.filter(lake => {
                return lake.title.toLowerCase().startsWith(query.toLowerCase());
            });

            if (results.length == 0) {
                search.results = search.all_results.slice(0, config.max_search_results);
            } else if (results.length > config.max_search_results) {
                search.results = results.slice(0, config.max_search_results);
            } else {
                search.results = results;
            }
        }

        context.commit('setSearchResults', search);
    },

    resetSearchResults (context) {
        let search = {}
        search.query = null;
        search.results = config.LOADING;
        search.all_results = [];

        context.commit('setSearchResults', search);
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
        let geom = options['geom'] || undefined;

        if (lake) {
          geom = lake.geom || geom;
        }

        if (geom == undefined && lake) {
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
                console.error(e.message)
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
        else {
            context.dispatch('setLoading', false);
        }
    },

    fetchLakes (context, status) {
        let url = `${API_URL}/lake/?format=json`+`&status=`+status;
        return new Promise((resolve, reject) => {
            fetch(url).then(
                response => {
                    return response.json();
                }
            ).then(
                data => {
                    if (status == 'major') {
                        console.info("Fetched " + data.length + " major lakes");
                        context.commit("setLakes", data);
                    } else {
                        console.info("Fetched " + data.length + " minor lakes");
                        context.commit("addLakes", data);
                    }
                    resolve();
                }
            ).catch(
                e => {
                    console.log(e.message);
                    reject();
                }
            );
        });
    },

    setCurrentFocus (context, lake) {
        context.commit("setCurrentFocus", lake);
    },

    fetchLake (context, reachcode) {
        return new Promise((resolve, reject) => {
            fetch(
                `${API_URL}/lake/${reachcode}/?format=json`
            ).then(
                response => {
                    return response.json();
                }
            ).then(
                data => {
                    console.info("Fetched lake " + reachcode);
                    context.commit("setCurrentLake", data);
                    resolve();
                }
            ).catch(
                e => {
                    console.error(e.message);
                    reject();
                }
            );
        });
    },

    setCurrentLake (context, lake) {
        context.commit("setCurrentLake", lake);
    },

    setLoading (context, is_loading) {
        context.commit("setLoading", is_loading);
    },

    setIntroDismissed (context, dismissed) {
        context.commit("setIntroDismissed", dismissed);
    },

    fetchPage (context, slug) {
        return new Promise((resolve, reject) => {
            fetch(`${API_URL}/flatpage/${slug}/?format=json`).then(
                response => {
                    return response.json();
                }
            ).then(
                data => {
                    console.info("Fetched page " + slug);
                    context.commit("setCurrentPage", data);
                    resolve();
                }
            ).catch(
                e => {
                    console.error(e.message);
                    reject();
                }
            );
        });
    }
}

export default actions;
