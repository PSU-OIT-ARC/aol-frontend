
const LOADING = 'loading';
const MOBILE_MODE = {
    width: 600,
}

const ERROR_TYPES = {
    APP: 'App level error. Non-recoverable',
    MAP: 'Some map element did not load or map interaction failed',
    FETCH: 'Network connectivity or other backend issue'
}

const config = {
    backend_url: process.env.VUE_APP_API_URL,
    max_search_results: 10,
    is_mobile: function(window) {
        return window.innerWidth < MOBILE_MODE.width;
    },
    ERROR_TYPES: ERROR_TYPES
}

export default config
