import map_config from '@/components/map/config';
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

        context.commit('setSearchResults', search);
        if (query == null || query == '') {
            search.results = [];
            context.commit('setSearchResults', search)
            return;
        }

        let starts_with = context.getters.getLakes.filter(lake => {
            return lake.title.toLowerCase().startsWith(query.toLowerCase());
        });
        let includes = context.getters.getLakes.filter(lake => {
            return lake.title.toLowerCase().includes(query.toLowerCase());
        });
        let all_results = starts_with.concat(includes);
        let results = new Set(all_results);
        search.results = Array.from(results);

        context.commit('setSearchResults', search);
    },

    resetSearchResults (context) {
        console.debug("Resetting search results");

        let search = {query: '', results: []}
        context.commit('setSearchResults', search);
    },

    resetBounds (context) {
        console.debug("Resetting map bounds");

        const view = context.rootState.map_view;
        view.goTo(map_config.map_center).then(()=> {
          view.set('zoom', map_config.zoom);
        })
    },

    setZoom (context, zoom) {
        context.commit('setMapZoom', zoom);
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

        if (map == null) {
            console.warn("Map is not loaded. Cannot fit bounds.");
            return
        }

        let lake = options['lake'];
        let geom = options['geom'] || undefined;

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
                    console.log(e.message);
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
                    reject();
                }
            );
        });
    }
}

export default actions;
