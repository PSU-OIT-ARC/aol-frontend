const mutations = {

    setMap (state, map) {
        state.map_object = map;
    },

    setMapNode (state, node) {
        state.map_node = node;
    },

    setMapView (state, view) {
        state.map_view = view;
    },

    setSearchResults (state, data) {
        state.search.query = data.query;
        state.search.results = data.results;
        state.search.all_results = data.all_results;
    },

    setLakes (state, data) {
      state.lakes = data;
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

    setLoading (state, loading) {
        state.is_loading = loading;
    },

    setIntroDismissed (state, dismissed) {
      state.intro_dismissed = dismissed;
    }
}

export default mutations;
