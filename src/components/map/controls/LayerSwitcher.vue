<template>
  <div class='layer-switcher--container'>
    <h4>Map Layers</h4>
    <div class="close-filters" @click="emitFilterVisibility()">╳</div>
    <div class="layer base">
      <fieldset>
        <legend>Basemap</legend>
        <input type="radio"
               name="basemap"
               id="topo_basemap"
               :checked="topo_basemap"
               @change="selectBaseMap" />
        <label for="topo_basemap">Topo</label>
        <input type="radio"
               name="basemap"
               id="osm_basemap"
               :checked="osm_basemap"
               @change="selectBaseMap" />
        <label for="osm_basemap">OSM</label>
        <input type="radio"
               name="basemap"
               id="gray_basemap"
               :checked="gray_basemap"
               @change="selectBaseMap" />
        <label for="gray_basemap">Gray</label>
      </fieldset>
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
      <br><br>
      <input type="checkbox"
             :name="clustering"
             :checked="true"
             :id="clustering"
             @change="enableClustering" />
      <label :for="clustering">Enable point clustering</label>
    </div>
  </div>
</template>

<script>
import config from '@/components/map/config';

export default {
  name: 'layer-switcher',
  computed: {
    topo_basemap () {
      if (this.$store.state.map_object == null) {
        return false;
      }
      return this.$store.state.map_object.basemap.id == "topo";
    },
    osm_basemap () {
      if (this.$store.state.map_object == null) {
        return false;
      }
      return this.$store.state.map_object.basemap.id == "osm";
    },
    gray_basemap () {
      if (this.$store.state.map_object == null) {
        return false;
      }
      return this.$store.state.map_object.basemap.id == "gray";
    },
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
    selectBaseMap (event) {
      let map = this.$store.state.map_object;

      if (event.target.id == "topo_basemap") {
        map.basemap = "topo";
      }
      else if (event.target.id == "osm_basemap") {
        map.basemap = "osm";
      }
      else if (event.target.id == "gray_basemap") {
        map.basemap = "gray";
      }
    },
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
    },
    enableClustering (event) {
      let map = this.$store.state.map_object;
      if (event.target.checked) {
        map.findLayerById('lake_clusters').visible = true;
        map.findLayerById('lake_points_service_layer').visible = false;
      }
      else {
        map.findLayerById('lake_points_service_layer').visible = true;
        map.findLayerById('lake_clusters').visible = false;
      }
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
