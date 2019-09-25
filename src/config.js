

const LOADING = 'loading';
const VIEWPORTS = {
    handset: {
        width: 600
    },
    tablet: {
        width: 1200
    },
}

const ERROR_TYPES = {
    APP: 'App level error. Non-recoverable',
    MAP: 'Some map element did not load or map interaction failed',
    FETCH: 'Network connectivity or other backend issue'
}

const config = {
    backend_url: process.env.VUE_APP_API_URL,
    max_search_results: 10,
    ERROR_TYPES: ERROR_TYPES,

    is_mobile: function(window) {
        return window.innerWidth < VIEWPORTS.handset.width;
    },
    is_handset: function(window) {
        return window.innerWidth < VIEWPORTS.handset.width;
    },
    is_tablet: function(window) {
        return (window.innerWidth > VIEWPORTS.handset.width && 
                window.innerWidth < VIEWPORTS.tablet.width);
    }
}

export default config
