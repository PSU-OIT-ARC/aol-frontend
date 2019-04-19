<template>
  <div id='map' class='map' ref='map'></div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { loadModules } from 'esri-loader';
import config from '@/components/map/config';


export default {
  name: 'aol-map',
  data () {
    return {
      ...config,
      selectedAttributes: [],
      show_filters: false,
      show_legend: false
    }
  },
  computed: {
    ...mapGetters({ lakes: 'getLakes' }),
    ...mapGetters(['getCurrentLake', 'getLakeBySlug', 'getLakeByReachcode']),
  },
  methods: {
    ...mapActions([
      'fetchLakes', 'setCurrentLake', 'fitBounds',
      'searchLakes', 'setMapObject', 'setMapNode', 'setMapView'
    ]),
    selectLakeFromUrl () {
      let slug = this.$route.query['lake'];
      if (slug) {
        let lake = this.getLakeBySlug(slug);
        this.setCurrentLake(lake);
        this.fitBounds({lake: lake});
      }
    },
    showSideBar (lake) {
        this.$router.push({name: 'home', query: {'lake': lake.slug}})
        this.setCurrentLake(lake);
        this.searchLakes(null); // reset search
    },
    selectLakeFromClick (event, view) {
        console.log(event)
        view.hitTest(event).then((response) => {
            let features = response.results.filter((r) => {
              if (r.graphic) {
                return r.graphic.layer.id = 'lake_markers'
              }
              return false
            })
            if (features.length) {
              let reachcode = features[0].graphic.attributes.reachcode;
              let lake = this.getLakeByReachcode(reachcode);
              this.showSideBar(lake);
              this.fitBounds({geom: features[0].graphic.geometry});
            }
        });
    },
    getLakeMarkers (FeatureLayer) {

      if(!this.lakes.length) return;

      const fields = [
        {
          name: "ObjectID",
          alias: "id",
          type: "oid"
        }, {
          name: "name",
          alias: "name",
          type: "string"
        }, {
          name: "reachcode",
          alias: "reachcode",
          type: "integer"
      }];

      let lakes = this.lakes;
      // Add a bunch of dummy points to test clustering
      let others = [];
      for (let i = 0; i < 20; i++) {
        let other = Object.assign({}, this.lakes[i%3]);
        let center = this.lakes[i%3].center.map((c) => {
          return c + 1.1 * (0.4-Math.random())
        });
        other.reachcode = 123456789 + (i * 4)
        other.center = center;
        other.has_plants = Math.random() > 0.3 ? true : false;
        others.push(other);
      }
      lakes = lakes.concat(others);

      lakes = lakes.map((lake) => {
        return {
            attributes: {
              name: lake.slug,
              id: lake.reachcode,
              reachcode: lake.reachcode,
              has_plants: Math.random() > 0.5 ? true : false,
              has_docs:  Math.random() > 0.4 ? true : false,
            },
            geometry: {
              type: "point",
              x: lake.center[1],
              y: lake.center[0]
            }
          }
      });
      let layer = new FeatureLayer({
          source: lakes,
          fields: fields,
          id: 'lake_markers'
      });
      this.lake_markers_layer = layer;
      this.lake_markers = lakes;
      this.map.add(layer)
      this.$emit('layer-ready', {
        markers: lakes,
        layer: layer
      });
    },
    // end methods
  },
  mounted () {
    loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/layers/VectorTileLayer',
      'esri/layers/TileLayer',
      'esri/identity/IdentityManager',
      'esri/layers/FeatureLayer'
    ]).then(([
        EsriMap, MapView,
        VectorTileLayer, TileLayer,
        IdentityManager, FeatureLayer
    ]) => {

      // avoid re-rendering map when using client-side routing.
        if (this.$store.state.map_node == null) {
          // TODO: get token from backend
          IdentityManager.registerToken({
              'server': config.ArcGisOnlineTilesUrl,
              'token': config.token
          });

          let map = new EsriMap({
              basemap: 'gray'
          });
          let view = new MapView({
              map: map,
              container: 'map',
              zoom: config.zoom,
              center: config.map_center,
          });
          view.ui.components = [];

          let nlcd = config.baseLayers[1];
          let nlcd_layer = new TileLayer({
              url: nlcd.url
          });
          map.add(nlcd_layer);

          config.vectorTileLayers.forEach((layer) => {
              let vector_tile_layer = new VectorTileLayer({
                  url: layer.getLayerUrl(),
                  id: layer.id,
                  visible: layer.visible,
                  minScale: layer.minScale
              })
              map.add(vector_tile_layer);
          });
          view.when().then(()=> {
              view.on('click', (event) => this.selectLakeFromClick(event, view))
          });
          this.setMapObject(map);
          this.setMapNode(this.$refs.map);
          this.setMapView(view);
          this.map = map;
        }
      else {
        this.$refs.map.appendChild(this.$store.state.map_node)
        this.map = this.$store.state.map_object;
      }

      // get lakes from JSON
      // Then generate markers layer
      // this layer will be replaced with AGOL feature service
      if(!this.lakes.length) {
        this.fetchLakes().then(()=> {
          this.selectLakeFromUrl();
          this.getLakeMarkers(FeatureLayer);
        });
      }
      else {
        console.log('I already have the lakes. I will not fetch them again');
        this.selectLakeFromUrl();
        this.getLakeMarkers(FeatureLayer);
      }

    });
  }
  // end mounted
}
</script>

<style lang="scss" scoped></style>
