<template>
  <div id="search-wrapper">
    <search-bar></search-bar>

    <search-results v-if="results!=''" :results="results" :query="query"></search-results>

    <div v-else class="site-intro">
      <div class="intro__photo">
      </div>
      <div class="intro__copy">
        <h3>Atlas of Oregon Lakes</h3>
        <p>Oregon has a rich diversity of lakes and reservoirs ranging from some of the clearest lakes in the world, to extremely productive fisheries, to lakes in trouble from pollution. Lakes and reservoirs are very important to the citizens of Oregon as they provide drinking water, flood control, irrigation, power generation, and recreational opportunities such as swimming, boating, fishing, and relaxation.</p>
        <p><a href="/about">Read More ...</a></p>
      </div>
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
    overflow-y: scroll;
    box-sizing: border-box;
    animation: ease-in-on-load 200ms forwards;

    @include respond-to(handheld) {
      left: 0px;
      width: 100%;
      padding: 15px;
    }
  }

  .site-intro {
    display:grid;
    grid-template-rows: 140px auto;
    background-color: white;
    min-height: 300px;
    margin-top: 20px;
    box-shadow: 2px 2px 3px #ccc;

    @include respond-to(handheld) {
      box-shadow: none;
      position: absolute;
      bottom: 15px;
      margin-right: 15px;
    }

    .intro__photo {
      height: 140px;
      background-image: url('~@/assets/generic_thumb_large.png');
      background-repeat: no-repeat;
      background-size: cover;
    }

    .intro__copy {
      padding: 20px;
    }
  }


</style>
