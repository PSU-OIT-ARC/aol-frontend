const mutations = {

    setTimestamp (state, options) {
        state.timestamp[options.label] = options.timestamp;
    },

    setMap (state, map) {
        state.map_object = map;
    },

    setMapNode (state, node) {
        state.map_node = node;
    },

    setMapView (state, view) {
        state.map_view = view;
    },

    setMapBasemap (state, basemap) {
        state.map_basemap = basemap;
    },

    setMapFilter (state, filter) {
        state.map_filter = filter;
    },

    setSearchResults (state, data) {
        state.search.query = data.query;
        state.search.results = data.results;
    },

    setLakes (state, data) {
      state.lakes = data;
    },

    addLakes (state, data) {
      state.lakes = state.lakes.concat(data);
    },

    setCurrentFocus (state, data) {
      state.current_focus = data;
    },

    setMapZoom (state, zoom) {
        state.map_zoom = zoom;
    },

    setCurrentLake (state, data) {
      state.current_lake = data;
    },

    setCurrentPage (state, page) {
        state.current_page = page;
    },

    setLoading (state, loading) {
        state.is_loading = loading;
    },

    setError (state, error_type) {
        state.error = error_type;
    },

    setIntroDismissed (state, dismissed) {
      state.intro_dismissed = dismissed;
    }
}

export default mutations;
