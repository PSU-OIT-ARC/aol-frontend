<template>
  <div class='map-container'>
    <div id="map" class='map'></div>
  </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex';
import * as proj from 'ol/proj';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import MVT from 'ol/format/MVT.js';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import VectorTileSource from 'ol/source/VectorTile.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile.js';
import OSM, {ATTRIBUTION} from 'ol/source/OSM.js';
import stylefunction from 'ol-mapbox-style/stylefunction';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

export default {
  name: 'aol-ol-map',
  data () {
    return {
      zoom: 8,
      /* Open Street Maps Base Layer */
      //baseLayerUrl: "https://{a-c}.tile.osm.org/{z}/{x}/{y}.png",
      baseLayerUrl: "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      //baseLayerUrl: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      //otherLayerUrl: 'http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg',
      VectorPubUrl: "https://tiles.arcgis.com/tiles/6Miy5NqQWjMYTGFY/arcgis/rest/services/Vector_Publands/VectorTileServer/tile/{z}/{y}/{x}.pbf?token=WlTafmvrujX0RXuKfJg3EP-pTf3RVpG-cy_sRsrA1u1l3807JLmogJVzQMvuS0Gw5F3iqyxZ1nYwG-sg6CSZYfsfCHEVjxs8ghQqHIgaw3Qjv_T93x-O0Y4thLto5iacqfN-TfLWYBlBnwXr60RGjan7-Jm3nhcwAlh69L8DDNJlLJU-_WkbVjUtjlE13O1QOHuTfZVizdmBkUjDTfx4q0xPkzNoJZUcpPr0-vhTH0GznGQH64ytxag82P89G0tfbyaVu7gwkUZSqVA7V9TaPMQSCSR-YrDXqyMwjxAD7zg",
      //center: [44.72925, -121.0411856],
      //center: [-121.0411856, 44.72925],
      controls: {
        zoom: true,
      },
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
  },
  computed: {
    ...mapGetters(
        {lakes: 'getLakes', getLakeBySlug: 'getLakeBySlug'}, 'getCurrentLake'),
    center () {
      return proj.fromLonLat([-122.60411856, 43.902925], 'EPSG:3857')
    },
  },
  methods: {
    ...mapActions([
      'fetchLakes', 'setCurrentLake', 'fitBounds',
      'searchLakes', 'setMapObject'
    ]),
    checkLakeBounds (pixel) {
      //let coords = proj.toLonLat([lat, lon], 'EPSG:3857')
      //console.log(coords)
      console.log(pixel)
      // see hitTolerance
      this.map.forEachFeatureAtPixel(pixel, (feature, layer) => {
          let lake = this.getLakeBySlug(feature.getProperties().name);
          this.showSideBar(lake);
          //console.log(`im a layer ${feature.getProperties()}`);
        }, {
        layerFilter: (layer_candidate) => {
          return layer_candidate.getProperties().name == 'lake';
        }
      });
    },
    drawLakes () {
      let lake_features = [];
      let lakeStyle = new Style({
        fill: new Fill({
          color: 'rgba(0, 0, 0, 0.1)'
        }),
        stroke: new Stroke({
          color: '#319FD3',
          width: 1
        }),
      });
      this.lakes.map((lake) => {
        //console.log(lake)
        let transformed_geom = lake.geom.map((coord) => {
            return proj.fromLonLat([coord[1], coord[0]], 'EPSG:3857');
        });
        //console.log(transformed_geom)
        let polygon = new Polygon([transformed_geom]);
        //console.log(polygon)
        let lake_feature = new Feature({
          geometry: polygon,
          id: lake.reachcode,
          name: lake.slug
        });
        lake_features.push(lake_feature);
      });
      //console.log(lake_features)
      let lakes_layer = new VectorLayer({
        source: new VectorSource({
          features: lake_features
        }),
        style: lakeStyle,
        name: 'lake'
      });
      this.lakes_layer = lakes_layer;
      this.map.addLayer(lakes_layer);
    },
    showSideBar (lake) {
      this.$router.push({name: 'home', query: {'lake': lake.slug}})
      this.setCurrentLake(lake);
      this.searchLakes(null); // reset search
      this.fitBounds({geom: lake.geom});
    },
    selectLakeFromUrl () {
      let slug = this.$route.query['lake'];
      if (slug) {
        let lake = this.getLakeBySlug(slug);
        this.setCurrentLake(lake);
        this.fitBounds({geom: lake.geom});
      }
    }
  },
  mounted () {
    // if this is all going to 'real' javascript
    // it shoud probably be a separate module
      let baselayer = new TileLayer({
        source: new OSM({
          url: this.baseLayerUrl
        })
      });

      let map = new Map({
        target: 'map',
        view: new View({
          center: this.center,
          zoom: 9.35
        }),
        layers: [baselayer,]
      });

      let vector_layer = new VectorTileLayer({
        source: new VectorTileSource({
          format: new MVT(),
          url: this.VectorPubUrl
        }),
        name: 'publand'
     });

    let style_url = "https://tiles.arcgis.com/tiles/6Miy5NqQWjMYTGFY/arcgis/rest/services/Vector_Publands/VectorTileServer/resources/styles/root.json?f=json&token=X_yghsylypn97rtHbkDQs2jSvCCfJFjy9c21yubfP5lsiH_i09SBK0N3sjots2YJAyLgyHqhYp1OVPd1X30Bu0PRVPEapAF37bl88xVHK9Yya8Vw_10h0AGKVpXpdZwpSBLj3A5zu6ZGfoB6vJyE13zSCqOPxVYzBIpSoc9HHQiUNwlhAs0swj6FlB4oh-uMHe-1F2ELK-ifG-V0veMnwhuNPn-YNA5W-uOkbjH7SffbwT_rEq1xTqvcBrwP2cpxJtSIWkPfYgIZnP8tdkngqqt-ueTydQcnSctPfD1lLV8.";

    fetch(style_url).then((response)=>{
      return response.json()
    }).then((style) => {
      //console.log(style)
      //console.log(vector_layer);
      stylefunction(vector_layer, style, 'esri');
    });

    map.addLayer(vector_layer);
    map.on('click', (e) => {
      this.checkLakeBounds(e.pixel);
    })
    this.map = map;
    this.setMapObject(map);
    // Fetching LAKES
    if(!this.lakes.length) {
      this.fetchLakes().then(()=> {
        this.selectLakeFromUrl();
      }).then(()=> {
        this.drawLakes();
      });
    }
    else {
      console.log('I already have the lakes. I will not fetch them again');
      this.drawLakes();
      this.selectLakeFromUrl();
    }
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
    height: 100%;
    max-height: 100vh;
  }



</style>
