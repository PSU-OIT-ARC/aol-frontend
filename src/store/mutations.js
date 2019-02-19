const mutations = {

    setSearchResults (state, results) {
        state.search_results = results;
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
}

export default mutations;
