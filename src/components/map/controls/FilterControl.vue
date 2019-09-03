<template>
  <div class='filter-control--container'>
    <h4>Map Filters</h4>
    <div class='filter'>
      <div v-for="filter in filters" :key='filter.name'>
        <input type='radio'
               :id="filter.name"
               :value='filter.name'
               :checked="getMapFilter() == filter.name"
               @change="selectLakesFromFilters(filter)"/>
        <label :for='filter.name'>{{ filter.label }}</label>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
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
      ]
    }
  },
  methods: {
    ...mapActions(['setMapFilter']),
    ...mapGetters(['getMapFilter', 'getLakes']),
    selectLakesFromFilters (filter) {
      const map = this.$store.state.map_object;
      const view = this.$store.state.map_view;

      let filtered_lakes = [];
      if (filter.name == 'all_lakes') {
        filtered_lakes = this.getLakes();
      }
      else {
        filtered_lakes = this.getLakes().filter((lake)=> {
            return lake[filter.name] == true;
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

      this.setMapFilter(filter.name);
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
