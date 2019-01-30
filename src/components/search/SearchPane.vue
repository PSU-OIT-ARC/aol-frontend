<template>
  <div id="search-wrapper">
    <search-bar></search-bar>
    <search-results :results="results" v-if="results"></search-results>
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
      results: 'searchResults'
    })
  },
  methods: {
    displayResults (val) {
      //this.results =;
    }
  }
}
</script>

<style scoped lang="scss">
  #search-wrapper {
    padding: 10px;
    height: 90vh;
    width: 33vw;
    position: absolute;
    left: 0;
    z-index: 1000;
    overflow-y: scroll;
  }
</style>
