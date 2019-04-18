<template>
  <div class='layer-switcher--container'>
    <h4>Map Layers</h4>
    <div class="close-filters" @click="emitFilterVisibility()">╳</div>

    <div class='layer base' v-for="layer in featureLayers">
      <input type='radio' :value='layer.name' :id="layer.name" :key='layer.name'
        v-model='selectedFeatureLayer' @change="emitFeatureLayerChange"/>
      <label :for='layer.name'>{{ layer.label }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'layer-switcher',
  data () {
    return {
      featureLayers: [
        {
          name: 'nopubland',
          label: 'Naturalistic'
        },
        {
          name: 'publand',
          label: 'Ownership'
        }
      ],
      selectedFeatureLayer: 'nopubland',
    }
  },
  methods: {
    emitFeatureLayerChange () {
      this.$emit('feature-layer-change', this.selectedFeatureLayer)
    },
    emitFilterVisibility () {
      this.$emit('show_filters', false);
    }
  }
}
</script>

<style scoped lang='scss'>
  div.layer {
      padding: 5px;
      display: inline-block;

      label {
        margin-left: 5px;
      }
  }




</style>
