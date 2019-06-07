const state = {
    user: {},
    current_lake: null,
    current_focus: null,
    lakes: [],
    search: {
        results: [],
        query: null
    },
    map_object: null,
    map_node: null,
    map_view: null,
    is_loading: false,
    intro_dismissed: false,
    current_page: false
}

export default state;
