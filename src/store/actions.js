import config from '@/config';


const API_URL = config.backend_url + '/api';

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

    setNotFound (context, not_found) {
        context.commit("setNotFound", not_found);
    },

    setError (context, error) {
        context.commit("setError", error);
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
        let url = `${API_URL}/lake/?status=`+status;
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

    fetchLake (context, params) {
        let reachcode = params['reachcode'];
        let storeData = true;
        if (params['store'] !== undefined && params['store'] == false) {
            storeData = false;
        }

        if (reachcode == null) {
            console.debug("Depopulating current lake");
            context.commit("setCurrentLake", null);
        } else {
            let url = `${API_URL}/lake/${reachcode}/?format=json`;
            return new Promise((resolve, reject) => {
                fetch(url).then(
                    response => {
                        if (!response.ok) {
                            throw new Error(response.status);
                        } else {
                            return response.json();
                        }
                    }
                ).then(
                    data => {
                        console.debug("Fetched lake " + reachcode);
                        if (storeData) {
                            context.commit("setCurrentLake", data);
                        }
                        resolve(data);
                    }
                ).catch(
                    e => {
                        if (e.message == '404') {
                            context.dispatch('setNotFound', true);
                            console.error("Resource '" + url + "' was not found.");
                            reject("Resource '" + url + "' was not found.");
                        } else {
                            context.dispatch('setError', config.ERROR_TYPES.FETCH)
                            console.error(e.message);
                            reject(e.message);
                        }
                    }
                );
            });
        }
    },

    fetchPage (context, params) {
        let slug = params['slug'];
        let storeData = true;
        if (params['store'] !== undefined && params['store'] == false) {
            storeData = false;
        }

        if (slug == null) {
            console.debug("Depopulating current page");
            context.commit("setCurrentPage", null);
        } else {
            let url = `${API_URL}/flatpage/${slug}/?format=json`;
            return new Promise((resolve, reject) => {
                fetch(url).then(
                    response => {
                        if (!response.ok) {
                            throw new Error(response.status);
                        } else {
                            return response.json();
                        }
                    }
                ).then(
                    data => {
                        console.debug("Fetched page " + slug);
                        if (storeData) {
                            context.commit("setCurrentPage", data);
                        }
                        resolve();
                    }
                ).catch(
                    e => {
                        if (e.message == '404') {
                            context.dispatch('setNotFound', true);
                            console.error("Resource '" + url + "' was not found.");
                            reject("Resource '" + url + "' was not found.");
                        } else {
                            context.dispatch('setError', config.ERROR_TYPES.FETCH)
                            console.error(e.message);
                            reject(e.message);
                        }
                    }
                );
            });
        }
    }
}

export default actions;
