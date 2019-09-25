

const getters = {

    getTimeElapsed (state) {
        return (label) => {
            return Date.now() - state.timestamp[label];
        }
    },

    getMapObject(state) {
        return state.map_object;
    },

    getMapView(state) {
        return state.map_view;
    },

    getMapZoom(state) {
        return state.map_zoom;
    },

    getMapBasemap (state) {
        return state.map_basemap;
    },

    getMapFilter (state) {
        return state.map_filter;
    },

    getMapFocus (state) {
        return state.map_focus;
    },

    getIsLoading (state) {
      return state.is_loading;
    },

    getIsIntroDismissed (state) {
      return state.intro_dismissed;
    },

    getSearchQuery (state) {
        return state.search.query;
    },

    getSearchResults (state) {
        return state.search.results;
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
    },
}

export default getters;
