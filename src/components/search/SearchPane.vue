<template>
  <div id="search-wrapper">
    <!--v-bind:style="[results ? {'z-index': 1000} : {'z-index': 'auto'}]"-->
    <search-bar></search-bar>
    <search-results :results="results" v-if="results.length"></search-results>
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
}
</script>

<style scoped lang="scss">
  #search-wrapper {
    height: 100%;
    width: 85%;
    margin: 12px 70px;
    position: absolute;
    left: 0;
    overflow-y: scroll;
  }
</style>
