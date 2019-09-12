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

    fitBounds (context, lake) {
        /*
        Zoom/pan to lake bounds.
        If the lake object has a cached geom attribute, goTo that extent
        Otherwise, query feature service for lake geometry using reachcode.
        */

        const map =  context.rootState.map_object;
        const view = context.rootState.map_view;

        const _buffer_extent = (geom) => {
            let extent = geom.extent.clone();
            extent.expand(map_config.extent_buffer)
            return extent
        }

        const _get_offset_center = (extent) => {
            let sidebar = document.querySelector('.sidebar_active .lake-sidebar');
            if (config.is_mobile(window) || !sidebar) {
                return null;
            }
            let  screen_extent_center = view.toScreen(extent.center)
             screen_extent_center.x -= sidebar.clientWidth/2;
            return view.toMap( screen_extent_center);
        }

        if (map == null || view == null) {
            console.warn("Map is not loaded. Cannot fit bounds.");
            return
        }

        if (lake == undefined) {
            console.debug('No lake provided to fitBounds:')
            return
        }

        if (lake.cached_geom == undefined) {
            console.debug('Fetching geometry from ArcGIS online')
            let lake_layer = map.findLayerById('lake_bbox_service_layer');
            let query = lake_layer.createQuery();
            query.where = `REACHCODE = ${lake.reachcode}`;
            query.maxRecordCountFactor = 4;
            lake_layer.queryFeatures(query).then((response) => {
                if (response.features.length) {
                    let geom = response.features[0].geometry;
                    console.debug('Caching lake geom returned from ARCGIS online query by reachcode')
                    lake.cached_geom = geom;
                    let extent = _buffer_extent(geom)
                    view.goTo(extent).then(()=>{
                        let offset = _get_offset_center(extent);
                        if (offset) {
                            view.goTo({center: offset}, {animate: false});
                        }
                   }).catch((e) => {
                       context.dispatch('setError', config.ERROR_TYPES.MAP)
                       console.error(e.message)
                   });
               }
           }).catch((e) => {
               console.error(e.message)
           });
        }
        else {
            console.debug('fitBounds using cached geom')
            let extent = _buffer_extent(lake.cached_geom);
            view.goTo(extent).then(()=>{
                let offset = _get_offset_center(extent);
                if (offset) {
                    view.goTo({center: offset}, {animate: false});
                }
            }).catch((e) => {
                console.error(e.message)
            });
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
