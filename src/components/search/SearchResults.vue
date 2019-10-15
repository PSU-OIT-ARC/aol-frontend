<template>
  <ul id="search-results-wrapper" ref='resultsWrapper' v-if="query">
    <li v-if="query && !results.length">
      <div class="no-results">Sorry, no results</div>
    </li>
    <li v-else v-for="result in currentResults" :key="result.reachcode">
      <router-link v-if="result.is_major" :to="lake_href(result)">
        <lake-card :lake="result"></lake-card>
      </router-link>
      <lake-card v-if="!result.is_major" :lake="result"></lake-card>
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';
import config from '@/config';
import LakeCard from '@/components/lake/LakeCard';

export default {
    name: 'search-results',
    props: ["query"],
    data () {
        return {
            numResults: config.max_search_results,
            currentResults: [],
        }
    },
    components: {
        LakeCard,
    },
    computed: {
        ...mapGetters({results: 'getSearchResults'}),
    },
    methods: {
        lake_href (lake) {
            return {name: 'map', query: {'lake': lake.reachcode}};
        },
        getMoreResults: _.debounce(
            function() {
                if (this.numResults <= this.results.length) {
                    this.numResults += config.max_search_results;
                    this.expandResults();
                }
            }, 100
        ),
        expandResults () {
            if (this.results.length) {
                this.currentResults = this.results.slice(0, this.numResults);
            }
        }
    },
    watch: {
        // reset numResults on query change
        'query': function () {
            this.numResults = config.max_search_results;
            this.expandResults();
        }
    },
    updated () {
        let container = this.$refs.resultsWrapper;
        if (container == undefined || container == null) {
            console.debug("Results container is not present");
            return
        }

        container.addEventListener('scroll', (e) => {
            let el = e.target;
            let buffer = 5;
            if (el.scrollTop >= el.offsetHeight - buffer) {
                this.getMoreResults();
            }
        });
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
    z-index: 3002;
    min-height: auto;
    max-height: 80vh;
    overflow-y: scroll;
    margin-top: 14px;
    padding: 0px 0px;
    color: #333;
    background-color: white;

    @include respond-to(handheld) {
      max-height: 60vh;
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
