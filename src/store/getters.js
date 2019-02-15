const getters = {

    searchResults (state) {
        return state.search_results;
    },

    getLakes (state) {
      return state.lakes;
    },

    getCurrentLake (state) {
      return state.current_lake
    },
}

export default getters;
