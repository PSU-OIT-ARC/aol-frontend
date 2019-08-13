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
  createFeatureLayerViews
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
                   'setLoading', 'setCurrentFocus', 'fitBounds',
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
      this.setCurrentFocus(lake);
      this.searchLakes(null); // reset search
    },
    selectLakeFromPointClick (event, view) {
      view.hitTest(event).then((response) => {
        let features = response.results.filter((r) => {
          if (r.graphic) {
            let is_a_marker = 'lake_clusters' && r.graphic.symbol.type == 'simple-marker';
            return r.graphic.layer.id == is_a_marker;
          }
          return false
        })
        if (features.length) {
          let reachcode = features[0].graphic.attributes.attributes.REACHCODE;
          let lake = this.getLakeByReachcode(parseInt(reachcode));
          if (lake) {
            this.showSideBar(lake);
          }
          this.fitBounds({lake: lake})
        }
      });
    },
    selectLakeFromBBoxClick (event, view) {
      view.hitTest(event).then((response) => {
        let features = response.results.filter((r) => {
          if (r.graphic) {
            return r.graphic.layer.id == 'lake_bbox_service_layer'
          }
          return false
        })
        if (features.length) {
          let reachcode = features[0].graphic.attributes.ReachCode;
          let lake = this.getLakeByReachcode(parseInt(reachcode));
          if (lake) {
            this.showSideBar(lake);
          }
          this.fitBounds({geom: features[0].graphic.geometry});
        }
      })
    },
    loadLayers (map, view) {
      return new Promise ((resolve) => {
        // TODO: The following utilities load layers which are hosted
        //       as secure (i.e., private) data sources. Such data sources
        //       are incompatible with app-based logins.
        createNLCDTileLayer(map);
        createVectorTileLayers(map);
        createFeatureServiceLayers(map, this);
        createFeatureLayerViews(map);

        view.when().then(()=> {
          // we might not need the point handler
          // if the bounding boxes are accurate enough?
          view.on('click', (event) =>
            this.selectLakeFromPointClick(event, view)
          );
          view.on('click', (event) =>
            this.selectLakeFromBBoxClick (event, view)
          );
          console.info("All layers loaded...")
          resolve();
        });
      }); // end promise
    },
    initMetadata () {
      if (!this.lakes.length) {
        return this.fetchLakes();
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
        this.fitBounds({lake: this.getCurrentFocus});
      } else {
        // initialize map context
        this.initMap().then(([map, view])=> {
          // load full lake dataset from backend
          this.initMetadata().then(()=> {
            // set current context
            this.selectLakeFromUrl();
            // load layers utilizing lake dataset
            this.loadLayers(map, view).then(()=> {
              if(this.getCurrentFocus) {
                this.fitBounds({lake: this.getCurrentFocus});
              }
            });
          });

        });
      }

      this.setLoading(false);

    });
  }, // end mounted
}
</script>

<style lang="scss" scoped>
.map {
  animation: fade-in 1000ms forwards;
}
</style>
