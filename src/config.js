
const LOADING = 'loading';
const MOBILE_MODE = {
    width: 600,
}

const config = {
    backend_url: process.env.VUE_APP_API_URL,
    max_search_results: 10,
    is_mobile: function(window) {
        return window.innerWidth < MOBILE_MODE.width;
    }
}

export default config
