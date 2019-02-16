const LOADING = 'loading';
const BASE_URL = '//localhost:8080';

const actions = {

    searchLakes (context, query) {
        if (query == null || query == '') {
            context.commit('setSearchResults', []);
            return;
        }
        context.commit('setSearchResults', LOADING);
        let results = context.getters.getLakes.filter(lake => {
            return lake.name.toLowerCase().startsWith(query.toLowerCase());
        });
        context.commit('setSearchResults', results);
    },

    fetchLakes (context) {
      fetch(
        `${BASE_URL}/data/lakes.json`
      ).then(
        response => {
          return response.json();
        }
      ).then(
        data => {
          context.commit("setLakes", data)
        }
      ).catch(
        e => {
          console.log(e.message);
      });
    },

    fetchLake (context, slug) {
      fetch(
        `${BASE_URL}/data/lake.json`
      ).then(
        response => {
          return response.json();
        }
      ).then(
        data => {
          context.commit("setCurrentLake", data)
        }
      ).catch(
        e => {
          console.log(e.message);
      });
    },

    setCurrentLake (context, lake) {
        context.commit("setCurrentLake", lake);
    },

}

export default actions;
