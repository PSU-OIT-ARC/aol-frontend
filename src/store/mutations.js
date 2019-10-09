const mutations = {

    setTimestamp (state, options) {
        state.timestamp[options.label] = options.timestamp;
    },

    setError (state, error_type) {
        state.error = error_type;
    },

    setMapObject (state, map_object) {
        state.map_object = map_object;
    },

    setMapView (state, options) {
        if (options.type == 'full') {
            state.map_view.full = options.view;
        } else {  // if (view_type == 'mini') {
            state.map_view.mini = options.view;
        }
    },

    setMapFocus (state, focus) {
        state.map_focus = focus;
    },

    setMapExtent (state, extent) {
        state.map_extent = extent;
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
    }

}

export default mutations;
