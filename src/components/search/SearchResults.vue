<template>
  <div id="search-results-wrapper">
    <p v-if="loading">Loading...</p>
    <div v-if="!getResults.length && !loading">
      <p>Sorry, no results</p>
    </div>
    <lake-card v-else class="search-card"
      v-for="result in getResults" :lake="result" :key="result.slug">
    </lake-card>
  </div>
</template>

<script>
import LakeCard from '@/components/lake/LakeCard';

export default {
  name: 'search-results',
  props: ["results"],
  components: {
    LakeCard
  },
  data () {
    return {
        loading: false,
        hide: false,
    }
  },
  computed: {
    getResults () {
      if (this.results == 'loading') {
        this.loading = true;
        return false;
      }
      else if (this.results.length == 0) {
        this.loading = false;
        return false;
      }
      this.loading = false;
      return this.results;
    }
  }
}
</script>

<style scoped lang="scss">
  #search-results-wrapper {
    background-color: white;
    height: auto;
    margin-top: 50px;
    padding: 5px 15px;
    color: #333;
  }
  .search-card {
    margin: 15px 0px;
  }
</style>
