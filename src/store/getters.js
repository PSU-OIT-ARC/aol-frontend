

const getters = {

    getTimeElapsed (state) {
        return (label) => {
            let ts = state.timestamp[label];
            if (ts === undefined || ts == null) {
                return null;
            }
            return Date.now() - ts
        }
    },

    getMapObject(state) {
        return state.map_object;
    },

    getMapView(state) {
        return state.map_view;
    },

    getMapFocus(state) {
        return state.map_focus;
    },

    getMapExtent(state) {
        return state.map_extent;
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
        return state.lakes;
    },

    getMinorLakes (state) {
        return state.minor_lakes;
    },

    getLakeByReachcode (state) {
        return (reachcode) => {
            let majorLakes = state.lakes.find((l) => {
                return parseInt(l.reachcode) === reachcode;
            });
            if (majorLakes !== undefined && majorLakes != null) {
                return majorLakes;
            } else {
                return state.minor_lakes.find((l) => {
                    return parseInt(l.reachcode) === reachcode;
                });
            }
        }
    },

    getReachcodes (state) {
        return state.lakes.map((lake) => {
            return parseInt(lake.reachcode);
        });
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
