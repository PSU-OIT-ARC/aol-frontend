// SUPER MAGIC BULLSHIT (i.e., 'markRaw')
//
// This use has to do with reactivity and the VUE 3 composition API
// (despite currently using compatibility mode as enabled in vue.config.js)
//
// FF console will show something like:
//
// TypeError: proxy must report the same value for the non-writable, non-configurable property '"__accessor__"'
//
import { markRaw } from 'vue';


const mutations = {

    setTimestamp (state, options) {
        state.timestamp[options.label] = options.timestamp;
    },

    setNotFound (state, not_found) {
        state.not_found = not_found;
    },

    setError (state, error) {
        state.error = error;
    },

    setMapObject (state, map_object) {
        let _map_object = map_object;
        if (map_object != null) {
            _map_object = markRaw(map_object);
        }
        state.map_object = _map_object;
    },

    setMapView (state, options) {
        let _view = options.view
        if (options.view != null) {
            _view = markRaw(options.view)
        }

        if (options.type == 'full') {
            state.map_view.full = _view;
        } else {  // if (view_type == 'mini') {
            state.map_view.mini = _view;
        }
    },

    setMapFocus (state, focus) {
        state.map_focus = focus;
    },

    setMapExtent (state, extent) {
        let _extent = extent;
        if (extent != null) {
            _extent = markRaw(extent);
        }
        state.map_extent = _extent;
    },

    setMapZoom (state, zoom) {
        state.map_zoom = zoom;
    },

    setMapBasemap (state, basemap) {
        state.map_basemap = basemap;
    },

    setMapFilter (state, filter) {
        state.map_filter = filter;
    },

    setLoading (state, loading) {
        state.is_loading = loading;
    },

    setIntroDismissed (state, dismissed) {
      state.intro_dismissed = dismissed;
    },

    setSearchResults (state, data) {
        state.search.query = data.query;
        state.search.results = data.results;
    },

    setLakes (state, data) {
      state.lakes = data;
    },

    setMinorLakes (state, data) {
      state.minor_lakes = data;
    },

    setCurrentFocus (state, data) {
      state.current_focus = data;
    },

    setCurrentLake (state, data) {
        state.current_lake = data;
    },

    setCurrentPage (state, page) {
        state.current_page = page;
    },

}

export default mutations;
