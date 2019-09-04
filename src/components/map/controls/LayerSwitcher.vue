<template>
  <div class='layer-switcher--container'>
    <h4>Map Base Layers</h4>
    <div class='layer'>
      <div v-for="layer in base_maps" :key='layer.name'>
        <input type='radio'
               :id="layer.name"
               :value='layer.name'
               :checked="getMapBasemap() == layer.name"
               @change="selectBaseMap(layer)"/>
        <label :for='layer.name'>{{ layer.label }}</label>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import config from '@/components/map/config';

export default {
  name: 'layer-switcher',
  data () {
    return {
      base_maps: [
        {
          name: 'topo',
          label: 'Topographic'
        },
        {
          name: 'osm',
          label: 'Streets'
        },
        {
          name: 'gray',
          label: 'Simple'
        },
      ],
      selectedBaseMap: 'topo'
    }
  },
  computed: {
    /*
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
    */
  },
  methods: {
    ...mapActions(['setMapBasemap']),
    ...mapGetters(['getMapBasemap']),
    selectBaseMap (layer) {
      this.setMapBasemap(layer.name);
    },
    /*
    selectVectorTileLayer (event) {
      let map = this.$store.state.map_object;
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
    }
    */
  }
}
</script>

<style scoped lang='scss'>
  div.layer {
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
