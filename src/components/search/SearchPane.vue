<template>
  <div>
    <div id="search-wrapper" v-bind:class="[{hide_results: hide_results}]">
      <search-bar></search-bar>
      <search-results v-if="results!=''" :results="results" :query="query"></search-results>
    </div>

    <div v-if="results==''">
      <div v-if="close_intro == false" class="site-intro">
        <div class="close-intro" @click="close_intro = true">╳</div>
        <div class="intro__photo">
        </div>
        <div class="intro__copy">
          <h3>Atlas of Oregon Lakes</h3>
          <p>Oregon has a rich diversity of lakes and reservoirs ranging from some of the clearest lakes in the world, to extremely productive fisheries, to lakes in trouble from pollution. Lakes and reservoirs are very important to the citizens of Oregon as they provide drinking water, flood control, irrigation, power generation, and recreational opportunities such as swimming, boating, fishing, and relaxation.</p>
          <p><a href="/about">Read More ...</a></p>
        </div>
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
  data() {
    return {
      close_intro: false
    }
  },
  computed: {
    ...mapGetters({
      results: 'searchResults',
      query: 'searchQuery'
    }),
    hide_results() {
      if (this.$route.query['lake']) {
        return true
      }
      return false;
    }
  },
}
</script>

<style scoped lang="scss">
  #search-wrapper {
    position: absolute;
    z-index: 1001;
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
      width: calc(100vw - 50px);
      height: auto;
    }
  }

  .site-intro {
    display:grid;
    grid-template-rows: 140px auto;

    position: absolute;
    z-index: 9998; /* 1 lower than LakeSidebar.vue */
    left: 15px;

    background-color: white;
    min-height: 300px;
    margin-top: 65px;
    box-shadow: 2px 2px 3px #ccc;
    width: 390px;

    @include respond-to(handheld) {
      width: calc(100vw - (30px + 50px)); //30 internal padding, 50 map controls offset
      top: 0vh;
    }

    .intro__photo {
      height: 140px;
      background-image: url('~@/assets/generic_thumb_large.png');
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center center;
    }

    .intro__copy {
      padding: 20px;
    }
  }

  .close-intro {
    position: absolute;
    top: 10px;
    right: 10px;
    color: white;
    font-size: 1.3em;
    cursor: pointer;
  }

</style>
