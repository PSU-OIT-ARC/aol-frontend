<template>
  <ul id="search-results-wrapper" ref='resultsWrapper' v-if="query">
    <div v-if="query && !results.length">
      <div class="no-results">Sorry, no results</div>
    </div>
    <div v-else>
      <li v-for="result in results" :key="result.reachcode">
        <router-link v-if="result.is_major" :to="href(result)">
          <lake-card :lake="result"></lake-card>
        </router-link>
        <lake-card v-if="!result.is_major" :lake="result"></lake-card>
      </li>
      <li v-show="showLoading" class='loading'>
        <loading-spinner/>
      </li>
    </div>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';
import config from '@/config';
import LakeCard from '@/components/lake/LakeCard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default {
  name: 'search-results',
  props: ["query"],
  data () {
    return {
      renderered_results: config.max_search_results
    }
  },
  components: {
    LakeCard,
    LoadingSpinner
  },
  updated () {
    let container = this.$refs.resultsWrapper;
    if (container) {
      container.addEventListener('scroll', (e) => {
        this.checkScrollBottom(e);
      });
    }
  },
  methods: {
    ...mapGetters(['searchResults']),
    href (lake) {
      return {name: 'home', query: {'lake': lake.reachcode}};
    },
    checkScrollBottom (e) {
      let el = e.target;
      let buffer = 5;
      if (el.scrollTop >= el.offsetHeight - buffer) {
        this.loadMoreResults();
      }
    },
    loadMoreResults: _.debounce(function () {
        if (this.renderered_results <= this.searchResults().length) {
          this.renderered_results += config.max_search_results;
        }
    }, 100),
  },
  computed: {
    results () {
      let results = this.searchResults().slice(0, this.renderered_results);
      return results
    },
    showLoading () {
       return  this.renderered_results <= this.searchResults().length;
    }
  },
  watch: {
    // reset renderered_results on query change
    'query': function () {
       this.renderered_results = config.max_search_results;
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
    overflow-y: scroll;
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

  li.loading {
    padding-top: 20px;
    text-align: center;
  }
</style>
