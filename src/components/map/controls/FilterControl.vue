<template>
  <div class='filter-control--container'>
    <div class='filter' v-for="filter in filters">

      <input type='radio' :value='filter.name' :id="filter.name"
        :key='filter.name' v-model='selectedFilters'
        @change="selectLakesFromFilters"/>

      <label :for='filter.name'>{{ filter.label }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'filter-control',
  props: ['lake_markers', 'lake_markers_layer'],
  data () {
    return {
      filters: [
        {
          name: 'has_plants',
          label: 'Plant data'
        },
        {
          name: 'has_docs',
          label: 'Marine board facilities'
        }
      ],
      selectedFilters: null //[]
    }
  },
  methods: {
    emitFilterChange () {
      this.$emit('filter-change', this.selectedFilters)
    },
    selectLakesFromFilters () {
      /* this will need to change to using a query
      if using a feature layer service in the future
      // like:
      this.view.whenLayerView(layer).then(function(layerView) {
        var query = layer.createQuery();
        layerView.queryFeatures(query).then((r)=>{
          console.log(r)
        });
      });
      // NOTE: To execute a query against all the features in a Feature Service
      // rather than only those in the client, you must use the
      // FeatureLayer.queryFeatures() method.
      */
      let filter = this.selectedFilters;
      if(!filter) return;
      let filtered_lakes = this.lake_markers.filter((lake) => {
        return lake.attributes[filter] == true
      });
      /*
      this.lake_markers_layer.applyEdits({
        addFeatures: filtered_lakes,
        deleteFeatures: this.lake_markers,
      }).catch((error) => {
          console.log('error: ' + error)
      })
      */
      // FlareClusterLayer is a GraphicsLayer not a FeatureLayer
      this.lake_markers_layer.setData(filtered_lakes);
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
    }
  }
</style>
