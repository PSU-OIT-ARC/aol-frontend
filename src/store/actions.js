const LOADING = 'loading';

const actions = {
    searchLakes (context, query) {
        if (query == null) {
            context.commit('setSearchResults', null);
            return;
        }
        context.commit('setSearchResults', LOADING);
        let results = query;
        setTimeout(() => {
            context.commit('setSearchResults', results);
        }, 400);
    },
}

export default actions;
