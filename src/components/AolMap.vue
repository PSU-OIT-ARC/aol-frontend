<template>
  <div class='map-container'>
    <l-map class='map' ref='AolMap' v-if='lakes' @click="latLn($event)"
      :zoom="zoom"
      :center="center">
      <l-tile-layer :url="baseLayerUrl"></l-tile-layer>
      <span v-for='lake in lakes'>
        <l-polygon @click="showSideBar(lake)"
          :lat-lngs="lake.geom"
          :color="polygon_color">
        </l-polygon>
        <l-circle-marker @click="showSideBar(lake)"
            :lat-lng="lake.center"
            :radius="marker.radius"
            :color="marker.color"
            :fill="marker.fill"
            :fillOpacity="marker.fillOpacity"
            :fillColor="marker.fillColor">
        </l-circle-marker>
      </span>
    </l-map>
    <side-bar
      v-if="currentLake" :lake="currentLake">
    </side-bar>
  </div>
</template>

<script>
import {LMap, LTileLayer, LCircleMarker, LPopup, LPolygon} from 'vue2-leaflet';
import { mapActions, mapGetters } from 'vuex';
import SideBar from '@/components/SideBar';

export default {
  name: 'aol-map',
  data () {
    return {
      zoom: 8,
      /* Open Street Maps Base Layer */
      baseLayerUrl: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      center: [44.72925, -121.0411856],
      marker: {
        radius: 3,
        color: 'blue',
        fill: true,
        fillColor: 'blue',
        fillOpacity: 1
      },
      polygon_color: "yellow",
    }
  },
  components: {
    LMap,
    LTileLayer,
    LCircleMarker,
    LPopup,
    LPolygon,
    SideBar
  },
  computed: {
    ...mapGetters({lakes: 'getLakes', currentLake: 'getCurrentLake'}),
  },
  methods: {
    ...mapActions(['fetchLakes', 'setCurrentLake']),
    showSideBar (lake) {
      this.setCurrentLake(lake);
      this.side_bar_active = true;
    },
    latLn (e) {
      console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng);
    }
  },
  created () {
    if(!this.lakes.length) {
      this.fetchLakes();
    }
    else {
      console.log('I already have the lakes. I will not fetch them again');
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.map = this.$refs.AolMap.mapObject;
    })
  }
}
</script>

<style lang="scss" scoped>
  /* Is this funny? */
  .map-container {
    height: 99vh;
    width: 100vw;
    margin: auto;
  }
  .map {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }


</style>
