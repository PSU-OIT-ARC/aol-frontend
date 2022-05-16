import config from '@/components/map/config';

const state = {
    // generic state
    is_loading: false,
    intro_dismissed: false,
    timestamp: {},
    not_found: false,
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
    map_basemap: 'topo-vector',
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
}

export default state;
