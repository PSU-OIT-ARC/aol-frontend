<template>
  <ul id="search-results-wrapper" v-if="query">
    <!-- <p v-if="loading">Loading...</p> -->
    <p v-if="loading">Loading...</p>
    <div v-else-if="!loading && query && !all_results.length">
      <div class="no-results">Sorry, no results</div>
    </div>
    <div v-else>
      <li v-for="result in all_results" :key="result.reachcode">
        <router-link :to="href(result)">
          <div v-if="result.is_major">
            <lake-card :lake="result"></lake-card>
          </div>
          <div v-else>
            <minor-lake-card :lake="result"></minor-lake-card>
          </div>
        </router-link>
      </li>
      <!-- <li class="show-all" v-if="all_results.length">
        <a href="#">Show all results</a> ({{all_results.length}})
      </li>-->
    </div>
  </ul>
</template>

<script>
import LakeCard from '@/components/lake/LakeCard';
import MinorLakeCard from '@/components/lake/MinorLakeCard';

export default {
  name: 'search-results',
  props: ["query", "results", "all_results"],
  components: {
    LakeCard,
    MinorLakeCard
  },
  methods: {
    href (lake) {
      return {name: 'home', query: {'lake': lake.reachcode}};
    }
  },
  computed: {
    loading () {
      if (this.results == 'loading') {
        return true;
      }
      return false;
    }
  }
}
</script>

<style scoped>

/* Styles in lakecard.scss */

a:link, a:visited {
  display: block;
  text-decoration: none;
  color: black;
}

a:hover, a:focus {
  background-color: transparent;
}

</style>

<style scoped lang="scss">
  #search-results-wrapper {
    position: relative;
    z-index: 99999;
    min-height: auto;
    max-height: 500px;
    overflow: scroll;
    margin-top: 14px;
    padding: 0px 0px;
    color: #333;
    background-color: white;
    @include respond-to(handheld) {
      max-height: 85vh;
    }
  }

  #search-results-wrapper li {
    opacity: 0;
    animation: drop-in 200ms forwards;
  }
  #search-results-wrapper li:nth-child(1) { animation-delay: .08s;}
  #search-results-wrapper li:nth-child(2) { animation-delay: .10s;}
  #search-results-wrapper li:nth-child(3) { animation-delay: .12s;}
  #search-results-wrapper li:nth-child(4) { animation-delay: .14s;}
  #search-results-wrapper li:nth-child(5) { animation-delay: .16s;}
  #search-results-wrapper li:nth-child(6) { animation-delay: .18s;}
  #search-results-wrapper li:nth-child(7) { animation-delay: .20s;}
  #search-results-wrapper li:nth-child(8) { animation-delay: .22s;}
  #search-results-wrapper li:nth-child(9) { animation-delay: .24s;}
  #search-results-wrapper li:nth-child(10) { animation-delay: .26s;}

  .no-results {
    padding: 20px;
  }

</style>
