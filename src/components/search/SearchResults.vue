<template>
  <div id="search-results-wrapper">
    <p>Results for: {{ results }}</p>
    <search-result v-for="result in results"></search-result>
  </div>
</template>

<script>
import SearchResult from "@/components/search/SearchResult";

export default {
  name: 'search-results',
  props: ["results"],
  components: {
    SearchResult
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
