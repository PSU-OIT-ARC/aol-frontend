<template>
  <div class='layer-switcher--container'>
    <h4>Map Layers</h4>
    <div class="close-filters" @click="emitFilterVisibility()">╳</div>
    <div class="layer base">
      <fieldset>
        <legend>Lands</legend>
        <input type="radio"
               name="lands"
               checked="checked"
               id="disablepublands"
               @change="selectVectorTileLayer" />
        <label for="disablepublands">None</label>
        <br />
        <input :type="ownershipLayer.input_type"
               :name="ownershipLayer.input_group"
               :checked="ownershipLayer.visible"
               :id="ownershipLayer.id"
               @change="selectVectorTileLayer" />
        <label :for="ownershipLayer.id">{{ ownershipLayer.name }}</label>
        <br />
        <input :type="naturalisticLayer.input_type"
               :name="naturalisticLayer.input_group"
               :checked="naturalisticLayer.visible"
               :id="naturalisticLayer.id"
               @change="selectVectorTileLayer" />
        <label :for="naturalisticLayer.id">{{ naturalisticLayer.name }}</label>
      </fieldset>
      <input :type="hillshadeLayer.input_type"
             :name="hillshadeLayer.input_group"
             :checked="hillshadeLayer.visible"
             :id="hillshadeLayer.id"
             @change="selectVectorTileLayer" />
      <label :for="hillshadeLayer.id">{{ hillshadeLayer.name }}</label>
      <input :type="bathymetryLayer.input_type"
             :name="bathymetryLayer.input_group"
             :checked="bathymetryLayer.visible"
             :id="bathymetryLayer.id"
             @change="selectVectorTileLayer" />
      <label :for="bathymetryLayer.id">{{ bathymetryLayer.name }}</label>
    </div>
  </div>
</template>

<script>
import config from '@/components/map/config';

export default {
  name: 'layer-switcher',
  computed: {
    hillshadeLayer () {
      return config.layers.find((l) => {return "nlcd" == l.id})
    },
    ownershipLayer () {
      return config.layers.find((l) => {return "publand" == l.id})
    },
    naturalisticLayer () {
      return config.layers.find((l) => {return "nopubland" == l.id})
    },
    bathymetryLayer () {
      return config.layers.find((l) => {return "bathymetry" == l.id})
    }
  },
  methods: {
    selectVectorTileLayer (event) {

      let map = this.$store.state.map_object;
      //let layers = map.allLayers;

      map.allLayers.forEach((layer) => {
          let configLayer = config.layers.find((l) => {
              return layer.id == l.id;
          });
          if (configLayer != null ) {
              if ( configLayer.input_group == event.target.name ) {
                  layer.visible = !event.target.checked;
              }
              if ( layer.id == event.target.id ) {
                  layer.visible = event.target.checked;
              }
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
