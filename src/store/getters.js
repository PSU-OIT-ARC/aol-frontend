const getters = {

    searchResults (state) {
        return state.search.results;
    },

    searchQuery (state) {
        return state.search.query;
    },

    getLakeBySlug (state) {
        return (slug) => {
            return state.lakes.find((lake) => {

                return lake.slug === slug
            });
        }
    },

    getLakes (state) {
      return state.lakes;
    },

    getCurrentLake (state) {
      return state.current_lake
    },
}

export default getters;
