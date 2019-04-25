<template>
  <div class='layer-switcher--container'>
    <h4>Map Layers</h4>
    <div class="close-filters" @click="emitFilterVisibility()">╳</div>

    <div class='layer base' v-for="layer in featureLayers">
      <input type='radio' :value='layer.name' :id="layer.name" :key='layer.name'
        v-model='selectedFeatureLayer' @change="selectVectorTileLayer"/>
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
    selectVectorTileLayer () {
      let selected_layer = this.selectedFeatureLayer;
      let map = this.$store.state.map_object;
      let layers = map.allLayers;
      let toggleable_layers = layers.filter((layer) => {
          let id = layer.id;
          return id == 'nopubland' || id == 'publand';
      });
      toggleable_layers.forEach((layer) => {
        if (layer.id != selected_layer) {
            layer.visible = false;
        }
        else if (layer.id == selected_layer) {
          layer.visible = true;
        }
      });
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
