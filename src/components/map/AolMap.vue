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
    ...mapGetters({ lakes: 'getLakes', 'reachcodes': 'getReachcodes' }),
    ...mapGetters(['getCurrentFocus', 'getLakeBySlug', 'getLakeByReachcode']),
  },
  methods: {
    ...mapActions(['getAuthToken',
                   'setMapObject', 'setMapNode', 'setMapView',
                   'setLoading', 'setCurrentFocus', 'resetSearchResults', 'fitBounds',
                   'fetchLakes', 'searchLakes']),

    selectLakeFromUrl () {
      let reachcode = this.$route.query['lake'];
      if (reachcode) {
        let lake = this.getLakeByReachcode(parseInt(reachcode));
        if (lake != null) { this.setCurrentFocus(lake); }
      }
    },
    showSideBar (lake) {
      this.$router.push({name: 'home', query: {'lake': lake.reachcode}})
      this.resetSearchResults(); // reset search
      this.setCurrentFocus(lake);
    },
    hideSideBar (lake) {
      let current = this.$router.history.current;
      if (current.name != "home" || current.query != {}) {
        this.$router.push({'name': 'home', query: {}})
      }
      this.resetSearchResults(); // reset search
      this.setCurrentFocus(null);
    },
    zoomToCluser (cluster_id, view) {
        let points = clusterIndex.getLeaves(cluster_id)
        Promise.all(points.map(convertGeoJsonToEsriFeature)).then(
          (points) => {
          view.goTo(points)
        });
    },
    selectFeatureFromClick(event, view) {
      view.hitTest(event).then((response) => {
        let features = response.results;
        if (!features.length) {
          this.hideSideBar();
          return;
        }
        for (let f of features) {
          if (f.graphic.attributes.hasOwnProperty('cluster')) {
             this.zoomToCluser(f.graphic.attributes.cluster_id, view)
             break;
          }
          else { // lake polyygon or lake point
            let reachcode = null;
            if (f.graphic.attributes.hasOwnProperty('ReachCode')) {
              reachcode = f.graphic.attributes.ReachCode
            }
            else if (f.graphic.attributes.hasOwnProperty('REACHCODE')) {
              reachcode = f.graphic.attributes.REACHCODE
            }

            let lake = this.getLakeByReachcode(parseInt(reachcode));
            if (lake === undefined || lake == null) {
              this.hideSideBar();
              this.fitBounds({geom: f.graphic.geometry});
            }
            else {
              this.showSideBar(lake);
              this.fitBounds({lake: lake});
            }
          }
        }
      })
    },
    loadLayers (map, view) {
      return new Promise ((resolve) => {
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
    initMetadata () {
      if (!this.lakes.length) {
          return this.fetchLakes('major');
      } else {
        return new Promise ((resolve) => {
          console.warn('I already have the lakes.');
          resolve();
        });
      }
    },
    initMap () {
      return new Promise ((resolve) => {
        loadModules([
          "esri/Map",
          "esri/views/MapView",
          "esri/widgets/Locate",
          "esri/identity/IdentityManager",
        ], config.dojo_options).then(([
            EsriMap, MapView, Locate, IdentityManager
        ]) => {


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
              basemap: 'topo'
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
  mounted () {
    this.$nextTick(() => {
      let map_node = this.$store.state.map_node;
      this.setLoading(true);

      if (map_node != null) {
        this.$refs.map.replaceWith(map_node)
        document.querySelector('#map').classList.toggle('small', this.small)
        if(this.getCurrentFocus) {
          this.fitBounds({lake: this.getCurrentFocus});
        }
      } else {
        // initialize map context
        this.initMap().then(([map, view])=> {
          // load full lake dataset from backend
          this.initMetadata().then(()=> {
            // set current context
            this.selectLakeFromUrl();
            this.loadLayers(map, view).then(()=> {
              console.info("All layers loaded...")
              this.setLoading(false);
              if(this.getCurrentFocus) {
                this.fitBounds({lake: this.getCurrentFocus});
              }
            });
            // de-prioritize loading of minor lakes.
            // re-select lake from URL and focus in the case
            // that it is a minor lake.
            this.fetchLakes('minor').then (()=> {
              this.selectLakeFromUrl();
              if(this.getCurrentFocus) {
                this.fitBounds({lake: this.getCurrentFocus});
              }
            });
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
