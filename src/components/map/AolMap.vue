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
    selectLakeFromClick (event, view) {
        console.log(event)
        view.hitTest(event).then((response) => {
            let features = response.results.filter((r) => {
              if (r.graphic) {
                return r.graphic.layer.id == 'lake_markers' && r.graphic.symbol.type == 'simple-marker'
              }
              return false
            })
            console.log(features)
            if (features.length) {
              let reachcode = features[0].graphic.attributes.attributes.REACHCODE;
              let lake = this.getLakeByReachcode(parseInt(reachcode));
              this.showSideBar(lake);
              this.fitBounds({geom: features[0].graphic.geometry});
            }
        });
    },
    generateLakeObjects (FeatureLayer) {

          let lakes = this.lakes;
          // Add a bunch of dummy points to test clustering
          let others = [];
          for (let i = 0; i < 200; i++) {
            let other = Object.assign({}, this.lakes[i%3]);
            let center = this.lakes[i%3].center.map((c) => {
              return c + 1.1 * (0.4-Math.random())
            });
            other.reachcode = parseInt(123456789 + (i * 4))
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
                name: lake.slug,
                id: lake.reachcode,
                reachcode: lake.reachcode,
                has_plants: Math.random() > 0.5 ? true : false,
                has_docs:  Math.random() > 0.4 ? true : false,
                geometry: {
                  type: "point",
                  x: lake.center[1],
                  y: lake.center[0],
                },
                x: parseFloat(lake.center[1]),
                y: parseFloat(lake.center[0]),
              }
          });
          /*
          let layer = new FeatureLayer({
              source: lakes,
              fields: config.lake_marker_fields,
              id: 'lake_markers'
          });

          this.lake_markers_layer = layer;
          */
        //  this.lake_markers = lakes;
          //this.map.add(layer)
          return lakes;
    },
    mountClusterLayer (
      SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
      ClassBreaksRenderer, fcl)
      {

        let query = this.lakesPointsFeatureLayer.createQuery()
        query.maxRecordCountFactor = 4;
        this.lakesPointsFeatureLayer.queryFeatures(query).then((results) => {

          const map = this.$store.state.map_object;
          let data = results.features.map((f) => {
            f.x = f.geometry.longitude;
            f.y = f.geometry.latitude;
            return f;
          });//this.lake_markers; //getLakeMarkers();

          const maxSingleFlareCount = 8;
          let areaDisplayMode = "activated";

          let defaultSym = new SimpleMarkerSymbol({
              size: 6,
              color: "#FF0000",
              outline: null
          });

          let renderer = new ClassBreaksRenderer({
              defaultSymbol: defaultSym
          });
          renderer.field = "clusterCount";

          let smSymbol = new SimpleMarkerSymbol({ size: 22, outline: new SimpleLineSymbol({ color: [221, 159, 34, 0.8] }), color: [255, 204, 102, 0.8] });
          let mdSymbol = new SimpleMarkerSymbol({ size: 24, outline: new SimpleLineSymbol({ color: [82, 163, 204, 0.8] }), color: [102, 204, 255, 0.8] });
          let lgSymbol = new SimpleMarkerSymbol({ size: 28, outline: new SimpleLineSymbol({ color: [41, 163, 41, 0.8] }), color: [51, 204, 51, 0.8] });
          let xlSymbol = new SimpleMarkerSymbol({ size: 32, outline: new SimpleLineSymbol({ color: [200, 52, 59, 0.8] }), color: [250, 65, 74, 0.8] });

          renderer.addClassBreakInfo(0, 19, smSymbol);
          renderer.addClassBreakInfo(20, 150, mdSymbol);
          renderer.addClassBreakInfo(151, 1000, lgSymbol);
          renderer.addClassBreakInfo(1001, Infinity, xlSymbol);


          let options = {
              id: "lake_markers",
              clusterRenderer: renderer,
              displayFlares: false,
              clusterRatio: 130,
              clusterToScale: 53672,
              clusterMinCount: 4,
              data: data
          }

          let clusterLayer = new fcl.FlareClusterLayer(options);
          console.log(clusterLayer)
          map.add(clusterLayer);
          return clusterLayer;

        }).catch((e)=> { console.log('error: ' + e)});

    }
    // end methods
  },
  mounted () {

        const options = {
          // tell Dojo where to load other packages
            dojoConfig: {
            async: true,

            packages: [
              {
                location: '/amd',
                name: 'fcl'
              },
            ]
          }
        };


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
        ], options).then(([
            EsriMap, MapView, Extent,
            VectorTileLayer, TileLayer,
            IdentityManager, FeatureLayer,
            SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
            ClassBreaksRenderer,
            fcl
        ]) => {

          const initMap = () => {
            // TODO: get token from backend
            IdentityManager.registerToken({
                'server': config.ArcGisOnlineTilesUrl,
                'token': config.token
            });
            IdentityManager.registerToken({
                'server': "https://services2.arcgis.com/6Miy5NqQWjMYTGFY/arcgis/rest/services/OR_Lake_Points_test/FeatureServer",
                'token': config.access_token
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

            this.setMapObject(map);
            this.setMapNode(this.$refs.map);
            this.setMapView(view);
            this.map = map;
            let lakesPointsFeatureLayer = new FeatureLayer({
              url:
                "https://services2.arcgis.com/6Miy5NqQWjMYTGFY/arcgis/rest/services/OR_Lake_Points_test/FeatureServer",
              id: 'lake_markers'
            });
            this.lakesPointsFeatureLayer = lakesPointsFeatureLayer;
            view.when().then(()=> {
                view.on('click', (event) => this.selectLakeFromClick(event, view));

            });

            this.lake_markers_layer = this.mountClusterLayer(
                SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
                ClassBreaksRenderer,
                fcl
            );
            /*
            this.$emit('layer-ready', {
              markers: this.lake_markers,
              layer: this.lake_markers_layer
            });
          */
          }

          // avoid re-rendering map when using client-side routing.
            let hasCachedMap = this.$store.state.map_node != null;
            if (hasCachedMap) {
              this.$refs.map.appendChild(this.$store.state.map_node)
              this.map = this.$store.state.map_object;
              this.selectLakeFromUrl();
            }
            else {
              if(!this.lakes.length) {
                this.fetchLakes().then(()=> {
                  this.lake_markers = this.generateLakeObjects()
                  initMap()
                  this.selectLakeFromUrl();
                })
              }
              else {
                console.log('I already have the lakes. I will not fetch them again');
                this.lake_markers = this.generateLakeObjects()
                initMap();
                this.selectLakeFromUrl();
              }
          }
    }); // end LoadModules.then

  }
  // end mounted
}
</script>

<style lang="scss" scoped></style>
