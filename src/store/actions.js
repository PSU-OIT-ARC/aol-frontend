import config from '@/config';


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

    setMapObject(context, map_object) {
        context.commit('setMapObject', map_object);
    },

    setMapView(context, options) {
        context.commit('setMapView', options);
    },

    setMapFocus(context, focus) {
        context.commit('setMapFocus', focus);
    },

    setMapExtent(context, extent) {
        context.commit('setMapExtent', extent);
    },

    setMapZoom(context, zoom) {
        context.commit('setMapZoom', zoom);
    },

    setMapBasemap (context, basemap) {
        let map =  context.getters.getMapObject;
        if (map != null) {
            console.debug("Using " + basemap + " base map");
            context.commit('setMapBasemap', basemap);
            map.basemap = basemap;
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
            let isPartialNumber = isNaN(numericalQuery) && numericalQuery.toString() != "NaN"
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

    fetchLakes (context, status) {
        let url = `${API_URL}/lake/?format=json`+`&status=`+status;
        return new Promise((resolve, reject) => {
            let firstFetch = !(context.getters.getLakes != null &&
                               context.getters.getLakes.length);
            let gte = context.getters.getTimeElapsed;
            let tsName = 'waterbody-' + status;
            let ts = gte(tsName);

            if (ts != null && ts < Date.now() - config.data_timeout) {
                console.info('The lake index is already loaded.');
                resolve(false, firstFetch);
                return
            } else {
                context.dispatch('markTimestamp', tsName);
            }

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
                        context.commit("setMinorLakes", data);
                    }
                    console.debug("Loading completed in " + gte(tsName) + "ms");
                    resolve(true, firstFetch);
                }
            ).catch(
                e => {
                    // Does this warrant a APP level error?
                    context.dispatch('setError', config.ERROR_TYPES.FETCH)
                    console.error(e.message);
                    reject();
                }
            );
        });
    },

    focusLake (context, reachcode) {
        try {
            let gl = context.getters.getLakeByReachcode;
            let lake = gl(parseInt(reachcode));

            if (lake != undefined && lake != null) {
                console.debug("Committing focus " + lake.reachcode);
                context.commit("setCurrentFocus", lake);
            } else if (context.getters.getCurrentFocus != null) {
                console.debug("Removing focus " + context.getters.getCurrentFocus.reachcode);
                context.commit("setCurrentFocus", null);
            }
        } catch (err) {
            console.error(err);
        }
    },

    fetchLake (context, reachcode) {
        if (reachcode == null) {
            console.debug("Depopulating current lake");
            context.commit("setCurrentLake", null);
        } else {
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
                        context.dispatch('setError', config.ERROR_TYPES.FETCH)
                        console.error(e.message);
                        reject();
                    }
                );
            });
        }
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
                    context.dispatch('setError', config.ERROR_TYPES.FETCH)
                    console.error(e.message);
                    reject();
                }
            );
        });
    }
}

export default actions;
