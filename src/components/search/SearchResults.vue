<template>
  <ul id="search-results-wrapper" v-if="query">
    <!-- <p v-if="loading">Loading...</p> -->
    <p v-if="loading">Loading...</p> 
    <div v-else-if="!loading && query && !results.length">
      <div class="no-results">Sorry, no results</div>
    </div>
    <div v-else>
      <li v-for="result in results" :key="result.reachcode">
        <lake-card :lake="result"></lake-card>
      </li>
      <li class="show-all" v-if="all_results.length">
        <a href="#">Show all results</a> ({{all_results.length}})
      </li>
    </div>
  </ul>
</template>

<script>
import LakeCard from '@/components/lake/LakeCard';

export default {
  name: 'search-results',
  props: ["query", "results", "all_results"],
  components: {
    LakeCard
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

<style scoped lang="scss">
  #search-results-wrapper {
    position: relative;
    z-index: 99999;
    min-height: auto;
    overflow: hidden;
    margin-top: 14px;
    padding: 0px 0px;
    color: #333;
    background-color: white;
  }

  #search-results-wrapper li {
    animation: drop-in 200ms forwards;
  }
  #search-results-wrapper li:nth-child(2n) {
    animation-delay: 100ms;
  }

  .no-results {
    padding: 20px;
  }

</style>
