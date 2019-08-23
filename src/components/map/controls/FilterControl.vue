<template>
  <div class='filter-control--container'>
    <h4>Map Filters</h4>
    <div class='filter'>
      <div v-for="filter in filters" :key='filter.name'>
        <input type='radio' :value='filter.name' :id="filter.name"
           v-model='selectedFilters'
          @change="selectLakesFromFilters"/>

        <label :for='filter.name'>{{ filter.label }}</label>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import config from '@/components/map/config';
import { createClusterIndex, updateClusters, clusterLayer } from '@/components/map/utils';

export default {
  name: 'filter-control',
  data () {
    return {
      filters: [
        {
          name: 'all_lakes',
          label: 'Show all lakes'
        },
        {
          name: 'has_plants',
          label: 'Plant data'
        },
        {
          name: 'has_mussels',
          label: 'Mussel data'
        }
      ],
      selectedFilters: 'all_lakes'
    }
  },
  computed: {
    ...mapGetters(['getLakeByReachcode', 'getMajorLakes'])
  },
  methods: {
    emitFilterChange () {
      this.$emit('filter-change', this.selectedFilters)
    },
    selectLakesFromFilters () {
      const map = this.$store.state.map_object;
      const view = this.$store.state.map_view;

      let filter = this.selectedFilters;
      let filtered_lakes = [];

      if (filter == 'all_lakes') {
        filtered_lakes = this.getMajorLakes;
      }
      else {
        filtered_lakes = this.getMajorLakes.filter((lake)=> {
            return lake[filter] == true;
        })
      }
      let filtered_reachcodes = filtered_lakes.map((l) => {
          return l.reachcode
      });
      let filtered_features = clusterLayer.featureStore.filter((f) => {
          return filtered_reachcodes.indexOf(f.attributes.REACHCODE) > -1
      });
      createClusterIndex(map, clusterLayer, filtered_features).then(() => {
          updateClusters(map, view)
      });
    },
  }
}
</script>

<style scoped lang='scss'>
  div.filter {
    padding: 5px;
    display: inline-block;

    label {
      margin-left: 5px;
      line-height: 2em;
      padding-left: 5px;
      width: 88%;
    }
  }
</style>
