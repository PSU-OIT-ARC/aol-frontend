<template>
  <ul id="search-results-wrapper" v-if="query">
    <p v-if="loading">Loading...</p>
    <div v-else-if="!loading && query && !results.length">
      <div class="no-results">Sorry, no results</div>
    </div>
    <li v-else v-for="result in results">
      <lake-card :lake="result" :key="result.slug">
    </lake-card>
    </li>
  </ul>
</template>

<script>
import LakeCard from '@/components/lake/LakeCard';

export default {
  name: 'search-results',
  props: ["results", "query"],
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
    color: #333;
    padding: 10px 0px;
    min-height: 50vh;
    overflow: hidden;
  }

  #search-results-wrapper li {
    animation: drop-in 200ms forwards;
  }
  #search-results-wrapper li:nth-child(2n) {animation-delay: 100ms;}


  .no-results {
    padding: 20px;
  }

</style>
