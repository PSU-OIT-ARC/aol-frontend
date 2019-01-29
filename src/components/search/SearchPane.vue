<template>
  <div id="search-wrapper">
    <search-bar @searched="displayResults"></search-bar>
    <search-results :results="results" v-if="results"></search-results>
  </div>
</template>

<script>
import SearchBar from "@/components/search/SearchBar";
import SearchResults from "@/components/search/SearchResults";

export default {
  name: 'search-pane',
  components: {
    SearchBar,
    SearchResults
  },
  data () {
    return {
      results: null
    }
  },
  methods: {
    displayResults (val) {
      this.results = val;
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
