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
    ...mapGetters(['getLakeByReachcode', 'getLakes'])
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
      let lake_markers_layer;


    //  if (this.clusteringEnabled) {
      lake_markers_layer = map.findLayerById('lake_clusters');
      if (lake_markers_layer.visible) {
        if (filter == 'all_lakes') {
          filtered_lakes = lake_markers_layer.data;
        }
        else {
          filtered_lakes = lake_markers_layer.data.filter((graphic) => {
            let reachcode = graphic.attributes.REACHCODE;
            let lake = this.getLakeByReachcode(parseInt(reachcode));
            if (lake) {
              return lake[filter] == true;
            }
            return false
          });
        }
        lake_markers_layer.setData(filtered_lakes);
      }
      else {
        if (filter == 'all_lakes') {
          filtered_lakes = this.getLakes;
        }
        else {
          filtered_lakes = this.getLakes.filter((lake)=> {
              return lake[filter] == true;
          })
        }
        let lake_reachcodes = filtered_lakes.map((l) => {
          return "'" + l.reachcode + "'";
        });
        let lake_markers_layer_view = view.allLayerViews.find((l)=> {
          return l.layer.id == 'lake_points_service_layer'
        })
        let query = {};
        query.where = `REACHCODE IN (${lake_reachcodes.join(',')})`;
        lake_markers_layer_view.filter = query;
      }
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
