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
      show_legend: false,
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
    selectLakeFromPointClick (event, view) {
        view.hitTest(event).then((response) => {
            let features = response.results.filter((r) => {
              if (r.graphic) {
                return r.graphic.layer.id == 'lake_clusters' && r.graphic.symbol.type == 'simple-marker'
              }
              return false
            })
            if (features.length) {
              let reachcode = features[0].graphic.attributes.attributes.REACHCODE;
              let lake = this.getLakeByReachcode(parseInt(reachcode));
              if (lake) {
                this.showSideBar(lake);
              }
              this.fitBounds({geom: features[0].graphic.geometry});
            }
        });
    },
    selectLakeFromBBoxClick (event, view) {
      view.hitTest(event).then((response) => {
        let features = response.results.filter((r) => {
          if (r.graphic) {
            return r.graphic.layer.id == 'lake_bbox_graphics_layer'
          }
          return false
        })
        if (features.length) {
          let reachcode = features[0].graphic.attributes.REACHCODE;
          let lake = this.getLakeByReachcode(parseInt(reachcode));
          if (lake) {
            this.showSideBar(lake);
          }
          this.fitBounds({geom: features[0].graphic.geometry});
        }
      })
    },
    BoundingBoxServiceToGraphicLayer (FeatureLayer) {
      const map = this.$store.state.map_object;
      const bbox_layer = map.findLayerById('lake_bbox_service_layer');
      let query = bbox_layer.createQuery()
      query.maxRecordCountFactor = 4; // get 4 * maxRecordCount (2000)
      bbox_layer.queryFeatures(query).then((results) => {
        let feature_layer = new FeatureLayer({
          source: results.features,
          id: 'lake_bbox_graphics_layer',
          fields: config.lake_marker_fields,
        })
        feature_layer.when().then((l) => {
          // change to transparent later
          l.renderer.symbol.color.a = 0.1;
          l.renderer.symbol.outline.color.a = 0.1;
        })
        map.add(feature_layer)
      }).catch((e)=> {
        console.log('error: ' + e)
      })
    },
    mountClusterLayer (
        SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
        ClassBreaksRenderer, fcl)
      {
        return new Promise ((resolve) => {
        const map = this.$store.state.map_object;
        const lake_markers_layer = map.findLayerById('lake_points_service_layer');

        let query = lake_markers_layer.createQuery()
        query.maxRecordCountFactor = 4; // get 4 * maxRecordCount (2000)
        lake_markers_layer.queryFeatures(query).then((results) => {

          // filter out lakes to show on map (TEMP CODE)
          let active_lakes = results.features.filter((f) => {
            let rc = f.attributes.REACHCODE
            return config.cms_reachcodes.indexOf(rc) > -1
          });

          // transform features objects to graphics objects
          let data = active_lakes.map((f) => {
            f.x = f.geometry.longitude;
            f.y = f.geometry.latitude;
            return f;
          });

          let defaultSym = new SimpleMarkerSymbol({
              size: 6,
              color: "#FF0000",
              outline: null
          });

          let clusterRenderer = new ClassBreaksRenderer({
              defaultSymbol: defaultSym
          });
          clusterRenderer.field = "clusterCount";

          let smSymbol = new SimpleMarkerSymbol({
              size: 22,
              color: [255, 204, 102, 0.9],
              outline: new SimpleLineSymbol({
                  color: [221, 159, 34, 0.9]
              }),
          });

          let mdSymbol = new SimpleMarkerSymbol({
              size: 24,
              color: [102, 204, 255, 0.9],
              outline: new SimpleLineSymbol({
                  color: [82, 163, 204, 0.9]
              }),
          });

          let lgSymbol = new SimpleMarkerSymbol({
              size: 28,
              color: [51, 204, 51, 0.9],
              outline: new SimpleLineSymbol({
                  color: [41, 163, 41, 0.9]
              }),
          });

          let xlSymbol = new SimpleMarkerSymbol({
            size: 32,
            color: [250, 65, 74, 0.9],
            outline: new SimpleLineSymbol({
                color: [200, 52, 59, 0.9]
            }),
          });

          clusterRenderer.addClassBreakInfo(0, 19, smSymbol);
          clusterRenderer.addClassBreakInfo(20, 150, mdSymbol);
          clusterRenderer.addClassBreakInfo(151, 1000, lgSymbol);
          clusterRenderer.addClassBreakInfo(1001, Infinity, xlSymbol);

          let options = {
              id: "lake_clusters",
              clusterRenderer: clusterRenderer,
              displayFlares: false,
              clusterRatio: config.clusterRatio,
              clusterToScale: config.clusterToScale,
              clusterMinCount: config.clusterMinCount,
              data: data
          }

          let clusterLayer = new fcl.FlareClusterLayer(options);
          map.add(clusterLayer);
          clusterLayer.when().then(()=> {
            resolve(clusterLayer)
          })
        }).catch((e)=> {
          console.log('error: ' + e)
        });
      });
    },
    initMap () {
      return new Promise ((resolve, reject) => {
        loadModules([
          'esri/Map',
          'esri/views/MapView',
          "esri/geometry/Extent",
          'esri/layers/VectorTileLayer',
          'esri/layers/TileLayer',
          'esri/identity/IdentityManager',
          'esri/layers/FeatureLayer',
          "esri/symbols/SimpleMarkerSymbol",
          "esri/symbols/SimpleLineSymbol",
          "esri/symbols/SimpleFillSymbol",
          "esri/renderers/ClassBreaksRenderer",
          "fcl/FlareClusterLayer_v4"
        ], config.dojo_options).then(([
            EsriMap, MapView, Extent,
            VectorTileLayer, TileLayer,
            IdentityManager, FeatureLayer,
            SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
            ClassBreaksRenderer,
            fcl
        ]) => {
          // TODO: get token from backend
          IdentityManager.registerToken({
              'server': config.ArcGisOnlineTilesUrl,
              'token': config.token
          });
          IdentityManager.registerToken({
              'server': "https://services2.arcgis.com/6Miy5NqQWjMYTGFY/arcgis/rest/services",
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

          config.featureServiceLayers.forEach((layer) => {
            let feature_layer = new FeatureLayer({
              url: layer.getLayerUrl(),
              id: layer.id,
              visible: layer.visible
            });
            map.add(feature_layer);
            //this[layer.id] = feature_layer;
          });

          this.setMapObject(map);
          this.setMapNode(this.$refs.map);
          this.setMapView(view);

          //create clusters
          this.mountClusterLayer(
              SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
              ClassBreaksRenderer,
              fcl
          );
          this.BoundingBoxServiceToGraphicLayer(FeatureLayer);
          view.when().then(()=> {
              view.on('click', (event) => this.selectLakeFromPointClick(event, view));
              view.on('click', (event) => this.selectLakeFromBBoxClick (event, view));

              resolve(map)
          });
        });
      });
    }, //end initMap
// end methods
  },
  mounted () {
  // avoid re-rendering map when using client-side routing.
    let hasCachedMap = this.$store.state.map_node != null;
    if (hasCachedMap) {
      this.$refs.map.appendChild(this.$store.state.map_node)
      this.selectLakeFromUrl();
    }
    else {
      if(!this.lakes.length) {
        this.fetchLakes().then(()=> {
          this.initMap().then(()=> {
            this.selectLakeFromUrl();
          });
        })
      }
      else {
        console.log('I already have the lakes. I will not fetch them again');
        this.initMap().then(() => {
          this.selectLakeFromUrl();
        });
      }
    }
  }
  // end mounted
}
</script>

<style lang="scss" scoped></style>
