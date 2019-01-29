<template>
  <div class='map-container'>
    <l-map class='map' ref='AolMap'
      :zoom="zoom"
      :center="center">
      <l-tile-layer :url="baseLayerUrl"></l-tile-layer>
      <l-polygon
        :lat-lngs="polygon.latlngs"
        :color="polygon.color">
      </l-polygon>
      <l-circle-marker
          :lat-lng="marker.center"
          :radius="marker.radius"
          :color="marker.color"
          :fill="marker.fill"
          :fillOpacity="marker.fillOpacity"
          :fillColor="marker.fillColor">
        <l-popup>
          <div>I am a popup with cool text</div>
        </l-popup>
      </l-circle-marker>
    </l-map>
  </div>
</template>

<script>
import {LMap, LTileLayer, LCircleMarker, LPopup, LPolygon} from 'vue2-leaflet';
export default {
  name: 'aol-map',
  data () {
    return {
      center: [45.118925, -121.7811856],
      zoom: 13,
      /* Open Street Maps Base Layer */
      baseLayerUrl: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      marker: {
        center: [45.1156925, -121.7811856],
        radius: 4,
        color: 'blue',
        fill: true,
        fillColor: 'blue',
        fillOpacity: 1
      },
      polygon: {
        latlngs: [
          [45.1469, -121.755],
          [45.1469, -121.77],
          [45.13664, -121.79016],
          [45.13464, -121.81416],
          [45.10562, -121.81814],
          [45.10458, -121.7712],
          [45.11552, -121.75110],
        ],
        color: 'yellow'
      }
    }
  },
  components: {
    LMap,
    LTileLayer,
    LCircleMarker,
    LPopup,
    LPolygon
  }
}
</script>

<style lang="scss" scoped>
  /* Is this funny? */
  .map-container {
    height: 60vh;
    width: 50vw;
    margin: auto;
  }
  .map {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }

</style>
