

const getters = {

    getTimeElapsed (state) {
        return (label) => {
            return Date.now() - state.timestamp[label];
        }
    },

    getMapBasemap (state) {
        return state.map_basemap;
    },

    getMapFilter (state) {
        return state.map_filter;
    },

    searchQuery (state) {
        return state.search.query;
    },

    searchResults (state) {
        return state.search.results;
    },

    getIsLoading (state) {
      return state.is_loading;
    },

    getIsIntroDismissed (state) {
      return state.intro_dismissed;
    },

    getLakes (state) {
      return state.lakes.filter((lake) => {
          return lake.is_major;
      })
    },

    getLakeByReachcode (state) {
        return (reachcode) => {
            return state.lakes.find((lake) => {
                return parseInt(lake.reachcode) === reachcode;
            });
        }
    },

    getReachcodes (state) {
        return state.lakes.filter((lake) => {
            return lake.is_major;
        }).map((lake) => {
            return parseInt(lake.reachcode);
        })
    },

    getCurrentFocus (state) {
      return state.current_focus;
    },

    getCurrentLake (state) {
      return state.current_lake;
    },

    getCurrentPage (state) {
        return state.current_page;
    }
}

export default getters;
