import config from '@/components/map/config';

const state = {
    // generic state
    is_loading: false,
    intro_dismissed: false,
    timestamp: {},
    error: null,

    // map objects
    map_object: null,
    map_view: {
        mini: null,
        full: null
    },

    // map state
    map_focus: false,
    map_extent: null,
    map_zoom: config.zoom,
    map_basemap: 'topo',
    map_filter: 'all_lakes',

    // lake state
    lakes: [],
    minor_lakes: [],
    search: {
        results: [],
        query: ''
    },
    current_lake: null,
    current_focus: null,

    // page state
    current_page: false,

    // offline assets
    cached_lakes: {},
    cached_pages: {}
}

export default state;
