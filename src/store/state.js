const state = {
    // generic state
    is_loading: false,
    intro_dismissed: false,
    timestamp: {},

    // map objects
    map_object: null,
    map_node: null,
    map_view: null,

    // lake state
    lakes: [],
    search: {
        results: [],
        query: null
    },
    current_lake: null,
    current_focus: null,

    // custom page state
    current_page: false

    //user: {},
}

export default state;
