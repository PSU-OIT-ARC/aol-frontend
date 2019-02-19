<template>
  <div id="search-results-wrapper" v-if="query">
    <p v-if="loading">Loading...</p>
    <div v-else-if="!loading && query && !results.length">
      <div class="no-results">Sorry, no results</div>
    </div>
    <lake-card v-else
      v-for="result in results" :lake="result" :key="result.slug">
    </lake-card>
  </div>
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
    background-color: white;
    height: auto;
    margin-top: 30px;
    padding: 15px;
    color: #333;
  }

  .no-results {
    padding: 15px;
  }

</style>
