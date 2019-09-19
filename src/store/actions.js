import map_config from '@/components/map/config';
import config from '@/config';
import { fitExtent } from '@/components/map/utils';

const API_URL = config.backend_url;
const actions = {

    markTimestamp (context, label) {
        context.commit("setTimestamp", {label: label, timestamp: Date.now()});
    },

    getAuthToken () {
        return fetch(`${API_URL}/token/?format=json`).then(response => {
            return response.json();
        });
    },

    setLoading (context, is_loading) {
        context.commit("setLoading", is_loading);
    },

    setError (context, error_type) {
        context.commit("setError", error_type);
    },

    setIntroDismissed (context, dismissed) {
        context.commit("setIntroDismissed", dismissed);
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

    setMapBasemap (context, basemap) {
        let map =  context.rootState.map_object;
        if (map != null) {
            console.debug("Using " + basemap + " base map");
            map.basemap = basemap;
            context.commit('setMapBasemap', basemap);
        }
    },

    setMapFilter (context, filter) {
        context.commit('setMapFilter', filter);
    },

    searchLakes (context, query) {
        let search = {};
        search.query = query;
        search.results = [];

        if (query == null || query == '') {
            search.results = [];
            context.commit('setSearchResults', search)
        } else {
            let numericalQuery = parseInt(query);
            let isPartialNumber = numericalQuery != NaN && numericalQuery.toString() != "NaN"
            if (isPartialNumber && query.length == numericalQuery.toString().length) {
                search.results = context.getters.getLakes.filter((lake) => {
                    return lake.reachcode == numericalQuery;
                });
            } else {
                let starts_with = context.getters.getLakes.filter(lake => {
                    return lake.title.toLowerCase().startsWith(query.toLowerCase());
                });
                let includes = context.getters.getLakes.filter(lake => {
                    return lake.title.toLowerCase().includes(query.toLowerCase());
                });
                search.results = Array.from(new Set(starts_with.concat(includes)));
            }
            context.commit('setSearchResults', search);
        }
    },

    resetSearchResults (context) {
        console.debug("Resetting search results");

        let search = {query: '', results: []}
        context.commit('setSearchResults', search);
    },

    fitBounds (context, lake) {
        //Zoom/pan to lake bounds.
        const map =  context.rootState.map_object;
        const view = context.rootState.map_view;
        fitExtent(map, view, lake).then((view) => {
            context.dispatch('setZoom', view.zoom)
        })
    },

    resetBounds (context) {
        console.debug("Resetting map bounds");

        const view = context.rootState.map_view;
        view.goTo(map_config.map_center).then(()=> {
          view.set('zoom', map_config.zoom);
          context.dispatch('setZoom', view.zoom);
        })
    },

    setZoom (context, zoom) {
        context.commit('setMapZoom', zoom);
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
                        console.debug("Fetched " + data.length + " major lakes");
                        context.commit("setLakes", data);
                    } else {
                        console.debug("Fetched " + data.length + " minor lakes");
                        context.commit("addLakes", data);
                    }
                    resolve();
                }
            ).catch(
                e => {
                    console.error(e.message);
                    // Does this warrant a APP level error?
                    context.dispatch('setError', config.ERROR_TYPES.FETCH)
                    reject();
                }
            );
        });
    },

    focusLake (context, reachcode) {
        let gl = context.getters.getLakeByReachcode;
        let lake = gl(parseInt(reachcode));

        if (lake != undefined && lake != null) {
            console.debug("Committing focus " + lake.reachcode);
            context.commit("setCurrentFocus", lake);
        } else if (context.rootState.current_focus != null) {
            console.debug("Removing focus " + context.rootState.current_focus.reachcode);
            context.commit("setCurrentFocus", null);
        }

        console.debug("Depopulating current lake");
        context.commit("setCurrentLake", null);
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
                    console.debug("Fetched lake " + reachcode);
                    context.commit("setCurrentLake", data);
                    resolve(data);
                }
            ).catch(
                e => {
                    console.error(e.message);
                    context.dispatch('setError', config.ERROR_TYPES.FETCH)
                    reject();
                }
            );
        });
    },

    fetchPage (context, slug) {
        return new Promise((resolve, reject) => {
            fetch(`${API_URL}/flatpage/${slug}/?format=json`).then(
                response => {
                    return response.json();
                }
            ).then(
                data => {
                    console.debug("Fetched page " + slug);
                    context.commit("setCurrentPage", data);
                    resolve();
                }
            ).catch(
                e => {
                    console.error(e.message);
                    context.disaptch('setError', config.ERROR_TYPES.FETCH)
                    reject();
                }
            );
        });
    }
}

export default actions;
