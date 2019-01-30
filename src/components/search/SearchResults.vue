<template>
  <div id="search-results-wrapper">
    <p v-if="loading">Loading...</p>
    <p v-else="loading">Results for: {{ getResults }}</p>
    <search-result v-for="result in getResults"></search-result>
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
        loading: false
    }
  },
  computed: {
    getResults () {
      if (this.results == 'loading') {
        this.loading = true;
        return;
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
    margin: 10px 60px;
    padding: 5px 15px;
    color: #333;
  }
</style>
