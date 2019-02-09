<template>
  <div class='map-container'>
    <l-map class='map' ref='AolMap' v-if='getLakes'
      :zoom="zoom"
      :center="center">
      <l-tile-layer :url="baseLayerUrl"></l-tile-layer>
      <span v-for='lake in getLakes'>
        <l-polygon
          :lat-lngs="lake.geom"
          :color="polygon_color">
          <l-popup>
            <div>
              <router-link
                :to="{ name: 'lake', params: { slug: lake.slug }}">
                {{ lake.name}}
              </router-link>
            </div>
          </l-popup>
        </l-polygon>
        <l-circle-marker
            :lat-lng="lake.center"
            :radius="marker.radius"
            :color="marker.color"
            :fill="marker.fill"
            :fillOpacity="marker.fillOpacity"
            :fillColor="marker.fillColor">
          <l-popup>
            <div>
              <router-link
                :to="{ name: 'lake', params: { slug: lake.slug }}">
                {{ lake.name}}
              </router-link>
            </div>
          </l-popup>
        </l-circle-marker>
      </span>
    </l-map>
  </div>
</template>

<script>
import {LMap, LTileLayer, LCircleMarker, LPopup, LPolygon} from 'vue2-leaflet';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'aol-map',
  data () {
    return {
      zoom: 9,
      /* Open Street Maps Base Layer */
      baseLayerUrl: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      center: [44.72925, -121.8811856],
      marker: {
        radius: 2,
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
    LPolygon
  },
  computed: {
    ...mapGetters(['getLakes']),
  },
  methods: {
    ...mapActions(['fetchLakes'])
  },
  created () {
    if(!this.getLakes.length) {
      this.fetchLakes();
    }
    else {
      console.log('I already have the lakes. I will not fetch them again');
    }
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
