<template>
  <div id='map' class='map'
     ref='map' :class="small ? 'small' : ''">
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { loadModules } from 'esri-loader';

import config from '@/components/map/config';
import {
  createNLCDTileLayer,
  createVectorTileLayers,
  createFeatureServiceLayers,
  updateClusters,
  convertGeoJsonToEsriFeature,
  clusterIndex
} from '@/components/map/utils';

export default {
  name: 'aol-map',
  props: {'small': { default: false }},
  data () {
    return {
      ...config,
      selectedAttributes: [],
      show_filters: false,
      show_legend: false,
    }
  },
  computed: {
    ...mapGetters({map: 'getMapObject',
                   lakes: 'getLakes',
                   reachcodes: 'getReachcodes',
                   currentFocus: 'getCurrentFocus',
                   currentLake: 'getCurrentLake'}),
  },
  methods: {
    ...mapGetters(['getTimeElapsed',
                   'getIsLoading',
                   'getMapBasemap',
                   'getLakeByReachcode',
                   'getCurrentFocus',
                   'getCurrentLake']),
    ...mapActions(['markTimestamp',
                   'getAuthToken',
                   'setMapObject', 'setMapNode', 'setMapView',
                   'setLoading',
                   'resetBounds', 'fitBounds']),


    zoomToCluser (cluster_id, view) {
        let points = clusterIndex.getLeaves(cluster_id)
        Promise.all(points.map(convertGeoJsonToEsriFeature)).then(
          (points) => {
          view.goTo(points)
        });
    },
    selectFeatureFromClick(event, view) {
      view.hitTest(event).then((response) => {

        let features = response.results.filter((result) => {
            return result.graphic.layer.id == "lake_bbox_service_layer" ||
                   (result.graphic.attributes != null &&
                    result.graphic.attributes.cluster);
        });

        for (let f of features) {
          if (f.graphic.attributes != null && f.graphic.attributes.cluster) {
             this.zoomToCluser(f.graphic.attributes.cluster_id, view)
             break;
          }

          let reachcode = null;
          if (f.graphic.attributes.hasOwnProperty('ReachCode')) {
            reachcode = f.graphic.attributes.ReachCode
          }
          else if (f.graphic.attributes.hasOwnProperty('REACHCODE')) {
            reachcode = f.graphic.attributes.REACHCODE
          }

          if (reachcode == null || reachcode == '') {
            console.debug("Selection does not provide a reachcode")
          } else {
            let gl = this.getLakeByReachcode();
            let lake = gl(parseInt(reachcode));
            if (lake != undefined && lake != null) {
              console.debug("Loading waterbody " + reachcode + " from index");
              this.$router.push({name: 'home', query: {'lake': lake.reachcode}});
            } else {
              console.debug("Waterbody " + reachcode + " not present in index");
            }
          }
        }
      })
    },
    loadLayers (map, view) {
      return new Promise ((resolve) => {
        this.markTimestamp('layers');

        // TODO: The following utilities load layers which are hosted
        //       as secure (i.e., private) data sources. Such data sources
        //       are incompatible with app-based logins.
        Promise.all([
          // NOTE: temporarily remove custom baselayers
            //createNLCDTileLayer(map),
            createVectorTileLayers(map),
            createFeatureServiceLayers(map, view, this)
        ]).then(() => {
          view.when(()=> {
            let gte = this.getTimeElapsed();
            console.debug("Loading map layers took " + gte('layers') + "ms");

            // we might not need the point handler
            // if the bounding boxes are accurate enough?
            view.on('click', (event) =>
              this.selectFeatureFromClick(event, view)
            );
            view.watch('zoom', function (zoom) {
              updateClusters(map, view).catch((e) => {
                console.error(e)
              })
            })
          });
          resolve();
        }).catch((e) => {
            console.error(e)
        })
      }); // end promise
    },
    initMap () {
      return new Promise ((resolve) => {
        this.markTimestamp('esri');

        loadModules([
          "esri/Map",
          "esri/views/MapView",
          "esri/widgets/Locate",
          "esri/identity/IdentityManager",
        ], config.dojo_options).then(([
            EsriMap, MapView, Locate, IdentityManager
        ]) => {
          let gte = this.getTimeElapsed();
          console.debug("Loading ESRI modules took " + gte('esri') + "ms");

          this.getAuthToken().then((data) => {
            let timeout = Date.now() + (parseInt(data.expires_in) * 1000)
            IdentityManager.registerToken({
              'server': config.ArcGisOnlineTilesUrl,
              'token': data.access_token,
              'expires': timeout
            });
            IdentityManager.registerToken({
              'server': config.ArcGisOnlineServicesUrl,
              'token': data.access_token,
              'expires': timeout
            });

            let zoom = config.zoom;
            let center = config.map_center;

            let map = new EsriMap({
              basemap: this.getMapBasemap()
            });
            let view = new MapView({
              map: map,
              container: 'map',
              zoom: zoom,
              center: center
            });
            view.constraints = { maxZoom: 15 };
            // we're using custom controls
            let locateWidget = new Locate({
              viewModel: {
                view: view
              },
              goToLocationEnabled: false,  // otherwise it starts immediately?
              declaredClass: 'aol-locate-widget'
            });

            view.ui.components = [locateWidget];
            view.when().then(()=> {
              this.setMapObject(map);
              this.setMapNode(this.$refs.map);
              this.setMapView(view);
              resolve([map, view])
            });
          }); // end getAuthToken
        }); // end loadModules
      }); // end Promise
    }, //end initMap
  }, // end methods
  watch: {
    currentFocus: function(val) {
      if (val != null && this.lakes.length) {
        this.fitBounds({lake: val});
      }
    },
    currentLake: function(val) {
      if (val != null && this.lakes.length) {
        this.fitBounds({lake: val});
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      let map_node = this.$store.state.map_node;
      if (map_node != null) {
        this.$refs.map.replaceWith(map_node)
        document.querySelector('#map').classList.toggle('small', this.small);

        if (this.getCurrentFocus() != null) {
          this.fitBounds({lake: this.getCurrentFocus()});
        } else if (this.getCurrentLake() != null) {
          this.fitBounds({lake: this.getCurrentLake()});
        }
      } else {
        // initialize map context
        this.setLoading(true);
        this.initMap().then(([map, view])=> {
          this.loadLayers(map, view).then(()=> {
            this.setLoading(false);
            document.querySelector('#map').classList.toggle('small', this.small);

            if (this.getCurrentFocus() != null) {
              this.fitBounds({lake: this.getCurrentFocus()});
            } else if (this.getCurrentLake() != null) {
              this.fitBounds({lake: this.getCurrentLake()});
            }
          });
        });
      }

    });
  }, // end mounted
}
</script>

<style lang="scss" scoped>
.map {
  animation: fade-in 1000ms forwards;
}
</style>
