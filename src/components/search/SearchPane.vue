<template>
  <div id="search-wrapper">
    <search-bar></search-bar>
    <search-results :results="results" :query="query"></search-results>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SearchBar from "@/components/search/SearchBar";
import SearchResults from "@/components/search/SearchResults";

export default {
  name: 'search-pane',
  components: {
    SearchBar,
    SearchResults
  },
  computed: {
    ...mapGetters({
      results: 'searchResults',
      query: 'searchQuery'
    })
  },
}
</script>

<style scoped lang="scss">
  #search-wrapper {
    max-width: 800px;
    min-width: 500px;
    margin: 12px 70px;
    position: absolute;
    left: 0;
    overflow-y: scroll;
    z-index: 1001;
  }
</style>
