

const LOADING = 'loading';
const VIEWPORTS = {
    tiny: {
        width: 350
    },
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
    data_timeout: new Date(0, 0, 0, 0, 15, 0, 0).getMilliseconds(),
    max_search_results: 10,
    ERROR_TYPES: ERROR_TYPES,

    is_mobile: function(window) {
        return window.screen.width < VIEWPORTS.handset.width;
    },

    is_tiny: function(window) {
        return window.screen.width < VIEWPORTS.tiny.width;
    },
    is_handset: function(window) {
        return window.screen.width < VIEWPORTS.handset.width;
    },
    is_tablet: function(window) {
        return (window.screen.width > VIEWPORTS.handset.width && 
                window.screen.width < VIEWPORTS.tablet.width);
    }
}

export default config
