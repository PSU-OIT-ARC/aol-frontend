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
    position: absolute;
    z-index: 1001;
    width: 400px;
    left: 0px;
    padding: 15px;
    min-height: 500px;
    overflow-y: scroll;
    box-sizing: border-box;
    @include respond-to(handheld) {
      left: 0px;
      width: 100%;
      padding: 15px;
    }
  }
</style>
