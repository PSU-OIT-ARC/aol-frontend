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

    getReachcodes () {
        return state.lakes.map((lake) => {
            return lake.reachcode
        })
    },

    getLakeByReachcode (state) {
        return (reachcode) => {
            return state.lakes.find((lake) => {
                return parseInt(lake.reachcode) === reachcode;
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
