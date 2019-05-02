<template>
  <div class='filter-control--container'>

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
          name: 'has_docs',
          label: 'Marine board facilities'
        }
      ],
      selectedFilters: 'all_lakes'
    }
  },
  computed: {
    ...mapGetters(['getLakeByReachcode'])
  },
  methods: {
    emitFilterChange () {
      this.$emit('filter-change', this.selectedFilters)
    },
    selectLakesFromFilters () {
      const map = this.$store.state.map_object;
      let filter = this.selectedFilters;
      let filtered_lakes = [];
      let lake_markers_layer = map.findLayerById('lake_clusters');

      if(!filter) return
      if (filter == 'all_lakes') {
        filtered_lakes = lake_markers_layer.data;
      }
      else {

        filtered_lakes = lake_markers_layer.data.filter((graphic) => {
          let reachcode = graphic.attributes.REACHCODE;
          // Temporary  fake filter
          let value = 0;
          if (filter == 'has_docs') value = 1;
          return reachcode % 2 == value;
          /*let lake = this.getLakeByReachcode(parseInt(reachcode));
          if (lake) {
            console.log(lake[filter])
            return lake[filter] == true;
          }
          return false
          */
        });
      }
      lake_markers_layer.setData(filtered_lakes);
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
