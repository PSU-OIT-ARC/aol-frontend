const mutations = {

    setSearchResults (state, data) {
        state.search.query = data.query;
        state.search.results = data.results;
    },

    setLakes (state, data) {
      state.lakes = data;
    },

    setCurrentLake (state, data) {
      state.current_lake = data;
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
}

export default mutations;
