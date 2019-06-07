const getters = {

    searchQuery (state) {
        return state.search.query;
    },

    searchResults (state) {
        return state.search.results;
    },

    searchResultsAll (state) {
        return state.search.all_results;
    },

    getLakeBySlug (state) {
        return (slug) => {
            return state.lakes.find((lake) => {
                return lake.slug === slug
            });
        }
    },

    getReachcodes (state) {
        return state.lakes.map((lake) => {
            return parseInt(lake.reachcode);
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

    getCurrentFocus (state) {
      return state.current_focus;
    },

    getCurrentLake (state) {
      return state.current_lake;
    },

    getIsLoading (state) {
      return state.is_loading;
    },

    getIsIntroDismissed (state) {
      return state.intro_dismissed;
    },

    getCurrentPage (state) {
        return state.current_page;
    }
}

export default getters;
