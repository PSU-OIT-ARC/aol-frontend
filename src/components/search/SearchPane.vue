<template>
  <div>
    <div id="search-wrapper" v-bind:class="[{hide_results: hide_results}]">
      <search-bar></search-bar>
      <search-results :query="query"></search-results>
    </div>
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
    ...mapGetters({query: 'getSearchQuery'}),
    hide_results() {
      if (this.$route.query['lake']) {
        return true
      }
      return false;
    }
  }
}
</script>

<style scoped lang="scss">
  #search-wrapper {
    position: absolute;
    z-index: 3002;
    left: 0px;
    padding: 15px;
    overflow: hidden;
    box-sizing: border-box;
    animation: fade-in 200ms forwards;
    height: auto;
    width: $sidebar_width;

    @include respond-to(handheld) {
      left: 0px;
      padding: 15px;
      width: calc(100vw);
      height: auto;
    }
  }
</style>
