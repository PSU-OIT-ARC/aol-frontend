<template>
  <div class='map-container'>
    <l-map class='map' ref='AolMap' v-if="lakes" @click="getFeature($event)"
      :zoom="zoom"
      :center="center">

      <l-control-layers
        :collapsed="false"
        :sort-layers="true">
      </l-control-layers>

      <l-tile-layer
        name="Watercolor"
        :url="otherLayerUrl"
        layer-type="base"
        :visible="false">
      </l-tile-layer>
      <l-tile-layer
        name="Open Street Maps"
        :url="baseLayerUrl"
        layer-type="base">
      </l-tile-layer>


      <span v-for='lake in lakes'>
        <l-polygon
          :lat-lngs="lake.geom"
          :lake="lake"
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
  </div>
</template>

<script>
import {
  LMap, LTileLayer, LCircleMarker, LPopup, LPolygon, LControlLayers
} from 'vue2-leaflet';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'aol-map',
  data () {
    return {
      zoom: 8,
      /* Open Street Maps Base Layer */
      baseLayerUrl: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
      otherLayerUrl: 'http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg',
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
    LControlLayers
  },
  computed: {
    ...mapGetters({lakes: 'getLakes', getLakeBySlug: 'getLakeBySlug'}),
  },
  methods: {
    ...mapActions([
      'fetchLakes', 'setCurrentLake', 'fitBounds',
      'searchLakes', 'setMapObject'
    ]),
    getFeature (e) {
      // not sure if there will be a feature layer for lakes geom that
      // we can query or if we'll due this all on the client (slow)?
      // this is hacky and not how we would actually do this but
      // can act as a proxy for querying features by click location
      let polygon = this.$refs.AolMap.$children.map(child => {
        let reference = {};
        reference['component'] = child;
        reference['layer'] = child.mapObject;
        return reference;
      }).find(p => {
          if ('getBounds' in p.layer) {
            // check if click is within 10% of bounds of polygon
            return p.layer.getBounds().pad(0.1).contains(e.latlng)
          }
      })
      if (polygon) {
        this.showSideBar(polygon.component.$attrs.lake);
      }
      // DEBUG
      console.log("Clicked: Lat, Lon: " + e.latlng.lat + ", " + e.latlng.lng);
    },
    showSideBar (lake) {
      this.$router.push({name: 'home', query: {'lake': lake.slug}})
      this.setCurrentLake(lake);
      this.searchLakes(null); // reset search
      this.fitBounds(lake.geom);
    },
    selectLakeFromUrl () {
      let slug = this.$route.query['lake'];
      if (slug) {
        let lake = this.getLakeBySlug(slug);
        this.setCurrentLake(lake);
        this.fitBounds(lake.geom);
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.map = this.$refs.AolMap.mapObject;
      this.setMapObject(this.map);
      if(!this.lakes.length) {
        this.fetchLakes().then(()=> {
          this.selectLakeFromUrl();
        });
      }
      else {
        console.log('I already have the lakes. I will not fetch them again');
        this.selectLakeFromUrl();
      }
    });
  }
}
</script>

<style lang="scss" scoped>
  /* Is this funny? */

  .map-container {
  }
  .map {
    overflow: hidden;
    position: relative;
  }


</style>
