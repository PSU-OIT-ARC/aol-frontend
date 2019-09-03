<template>
  <div>
    <div id="search-wrapper" v-bind:class="[{hide_results: hide_results}]">
      <search-bar></search-bar>
      <search-results v-if="results.length" :query="query" :results="results"></search-results>
    </div>

    <div v-if="!results.length">
      <div v-if="introDismissed == false" class="site-intro">
        <div class="close-intro" @click="close">
          <svg xmlns="http://www.w3.org/2000/svg" width="982" height="982" viewBox="0 0 982 982">
            <path fill-rule="evenodd" d="M576.8,491 L962.7,105.1 C987.2,80.6 987.2,43.8 962.7,19.3 C938.2,-5.2 901.4,-5.2 876.9,19.3 L491,405.3 L105.1,19.4 C80.6,-5.1 43.9,-5.1 19.3,19.4 C-5.2,43.9 -5.2,80.7 19.3,105.2 L402.2,491 L19.4,876.9 C-5.1,901.4 -5.1,938.2 19.4,962.7 C28.6,975 47,981.1 62.3,981.1 C77.6,981.1 92.9,975 105.2,962.7 L491,576.8 L876.9,962.7 C889.2,975 904.5,981.1 919.8,981.1 C935.1,981.1 950.4,975 962.7,962.7 C987.2,938.2 987.2,901.4 962.7,876.9 L576.8,491 Z"/>
          </svg>
        </div>
        <div class="intro__photo">
        </div>
        <div class="intro__copy">
          <h3>Atlas of Oregon Lakes</h3>
          <p>Oregon has a rich diversity of lakes and reservoirs ranging from some of the clearest lakes in the world, to extremely productive fisheries, to lakes in trouble from pollution. Lakes and reservoirs are very important to the citizens of Oregon as they provide drinking water, flood control, irrigation, power generation, and recreational opportunities such as swimming, boating, fishing, and relaxation.</p>
          <p><router-link to="/about">Read More ...</router-link></p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
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
      introDismissed: 'getIsIntroDismissed',
      query: 'searchQuery',
      results: 'searchResults',
    }),
    hide_results() {
      if (this.$route.query['lake']) {
        return true
      }
      return false;
    }
  },
  methods: {
    ...mapActions(['setIntroDismissed']),
    close () {
      this.setIntroDismissed(true);
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

  .site-intro {
    display:grid;
    grid-template-rows: 140px auto;

    position: absolute;
    z-index: 3001;
    left: 15px;

    background-color: white;
    min-height: 300px;
    margin-top: 65px;
    box-shadow: 2px 2px 3px #ccc;
    width: 390px;

    @include respond-to(handheld) {
      width: calc(100vw - 30px); //30 internal padding
      top: 0vh;
    }

    .intro__photo {
      height: 140px;
      background-image: url('~@/assets/intro-umpqua-lake.png');
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
    top: 6px;
    right: 10px;
    cursor: pointer;

    svg {
      fill: white;
      width: 16px;
      height: 16px;
    }
  }

</style>
