<template>
  <div id="search-results-wrapper">
    <p v-if="loading">Loading...</p>
    <div v-if="!getResults.length && !loading">
      <p>Sorry, no results</p>
    </div>
    <search-result v-else
      v-for="result in getResults" :lake="result">
    </search-result>
  </div>
</template>

<script>
import SearchResult from "@/components/search/SearchResult";

export default {
  name: 'search-results',
  props: ["results"],
  components: {
    SearchResult
  },
  data () {
    return {
        loading: false,
        hide: false,
    }
  },
  computed: {
    getResults () {
      if (this.results == 'loading') {
        this.loading = true;
        return false;
      }
      else if (this.results.length == 0) {
        this.loading = false;
        return false;
      }
      this.loading = false;
      return this.results;
    }
  }
}
</script>

<style scoped lang="scss">
  #search-results-wrapper {
    background-color: white;
    height: auto;
    margin-top: 52px;
    padding: 5px 15px;
    color: #333;
  }
</style>
