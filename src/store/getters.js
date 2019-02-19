const getters = {

    searchResults (state) {
        return state.search.results;
    },

    searchQuery (state) {
        return state.search.query;
    },

    getLakes (state) {
      return state.lakes;
    },

    getCurrentLake (state) {
      return state.current_lake
    },
}

export default getters;
