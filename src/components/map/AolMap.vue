<template>
  <div id='esri-map'
       class='map'
       :class="small ? 'small' : ''">
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { loadModules } from 'esri-loader';

import app_config from '@/config';
import config from '@/components/map/config';
import {
    // NOTE: temporarily remove custom baselayers
    // createNLCDTileLayer,

    createVectorTileLayers,
    createFeatureServiceLayers,
    convertGeoJsonToEsriFeature,
    clusterIndex,
    filterClusters,
    updateClusters,
    prepareExtent,
    checkExtent
} from '@/components/map/utils';

export default {
    name: 'aol-map',
    props: ['small', 'mode'],
    computed: {
        ...mapGetters({map: 'getMapObject',
                       views: 'getMapView',
                       basemap: 'getMapBasemap',
                       zoom: 'getMapZoom',
                       filter: 'getMapFilter',
                       focus: 'getMapFocus',
                       lakes: 'getLakes',
                       reachcodes: 'getReachcodes',
                       currentFocus: 'getCurrentFocus',
                       currentLake: 'getCurrentLake'}),
    },
    methods: {
        ...mapGetters(['getTimeElapsed',
                       'getLakeByReachcode']),
        ...mapActions(['markTimestamp', 'setError', 'getAuthToken',
                       'setMapObject', 'setMapView', 'setMapZoom',
                       'setLoading', 'setIntroDismissed', 'resetSearchResults']),

        onClick(event) {
          this.view.hitTest(event).then((response) => {

            let features = response.results.filter((result) => {
                return result.graphic.layer.id == "lake_bbox_service_layer" ||
                       (result.graphic.attributes != null &&
                        result.graphic.attributes.cluster);
            });

            // if selected feature is a cluster, fit to the cluster
            // else selected feature is waterbody feature, fit to it
            for (let f of features) {
              if (f.graphic.attributes != null && f.graphic.attributes.cluster) {
                this.fitCluster(f.graphic.attributes.cluster_id);
              } else { 
                let reachcode = null;
                if (Object.prototype.hasOwnProperty.call(f.graphic.attributes, 'ReachCode')) {
                  reachcode = f.graphic.attributes.ReachCode
                } else if (Object.prototype.hasOwnProperty.call(f.graphic.attributes, 'REACHCODE')) {
                  reachcode = f.graphic.attributes.REACHCODE
                }

                if (reachcode == null || reachcode == '') {
                  console.debug("Selection does not provide a reachcode")
                  return
                } else if (this.$route.name == 'home' &&
                           this.$route.query.lake == parseInt(reachcode)) {
                  console.warn("Selection made is the current selection");
                  return
                }

                let gl = this.getLakeByReachcode();
                let lake = gl(parseInt(reachcode));

                if (lake != undefined && lake != null) {
                  console.debug("Loading waterbody " + reachcode + " from index");
                  this.$router.push({name: 'home', query: {lake: lake.reachcode}});
                } else {
                  console.debug("Waterbody " + reachcode + " not present in index");
                }
              }
            }

          })
        },
        initBounds () {
            //
            // Initializes the extent of the map.
            //
            // Examines state to determine how to construct the extent.
            //
            console.debug("Initializing map bounds");

            if (this.currentFocus == null && this.currentLake == null) {
                if (this.focus == null ) {
                    this.resetSearchResults();
                    this.resetBounds();
                } else if (Number.isInteger(parseInt(this.focus))) {
                    let gl = this.getLakeByReachcode();
                    let lake = gl(parseInt(this.focus));
                    this.fitLake(lake);
                } else if (this.focus == 'none') {
                    console.debug("Keeping current map extent");
                }
            } else if (this.mode == 'full') {
                this.fitLake(this.currentFocus);
            } else if (this.mode == 'mini') {
                this.fitLake(this.currentLake);
            }
        },
        resetBounds () {
            //
            // Reset extent to fit all features this lets
            // the extent be viewable for any device
            //
            console.debug("Resetting map bounds");
            this.setLoading(true);

            let lake_boundaries_layer = this.map.findLayerById('lake_bbox_service_layer');
            lake_boundaries_layer.when(()=>{
              return lake_boundaries_layer.queryExtent();
            }).then((response) => {
              let extent = prepareExtent(this.view, response.extent);
              this.view.goTo(extent).then(() => {
                  this.setLoading(false);
              });
            }).catch((err) => {
               console.error(err);
               this.setLoading(false);
            });
        },
        fitLake (lake) {
            //
            // Zoom/pan to lake bounds.
            // 
            // If the geometry is computed via a feature service query using
            // the given reachcode.
            //
            if (this.map == null) {
                console.warn("Map is not loaded. Cannot fit lake.");
                return

            } else if (lake === undefined || lake == null) {
                console.error("Cannot fit to null or undefined lake.");
                return

            } else {
                console.debug("Fitting to bounds of "+lake.reachcode);
                this.setLoading(true);

                let lake_layer = this.map.findLayerById('lake_bbox_service_layer');
                if (lake_layer == null) {
                  console.warn("Lake bounding box layer not initialized.");
                  return
                }

                let query = lake_layer.createQuery();
                query.where = `REACHCODE = ${lake.reachcode}`;
                query.maxRecordCountFactor = 4;

                lake_layer.queryFeatures(query).then((response) => {
                    let features = response.features.filter((f) => {
                        // TODO: validate this guard
                        return f.geometry != null && f.geometry.extent != null;
                    });

                    if (features.length == 0) {
                        console.error("Got no result from querying features.");
                    } else if (features.length > 1) {
                        console.warn("Got more than one result from querying features.");
                    } else {
                        let tsName = 'fit-extent-for-'+lake.reachcode;
                        this.markTimestamp(tsName);

                        let extent = prepareExtent(this.view, features[0].geometry.extent);
                        this.view.goTo(extent).then(()=> {
                            let gte = this.getTimeElapsed();
                            console.debug("Fitting for geom took " + gte(tsName) + "ms");
                            this.setLoading(false);
                        });
                    }

                }).catch((err) => {
                    console.error(err)
                    this.setLoading(false);
                });

            }
        },
        fitCluster (cluster_id) {
            //
            // Zoom/pan to cluster bounds.
            //
            console.debug("Fitting to cluster "+cluster_id);
            this.setLoading(true)

            let points = clusterIndex.getLeaves(cluster_id)
            Promise.all(points.map(convertGeoJsonToEsriFeature)).then((points) => {
              this.view.goTo(points);
              this.setLoading(false);
            });
        },
        loadFeatures () {
          return new Promise ((resolve) => {
            if (this.map.features_loaded != undefined && this.map.features_loaded) {
              console.debug("Features already loaded.");
              resolve();

            } else {
              this.markTimestamp('esri-feature-layers');
              createFeatureServiceLayers(this.map, this.view, this.reachcodes).then(() => {
                let gte = this.getTimeElapsed();
                console.debug("Loading feature layers took " + gte('esri-feature-layers') + "ms");

                let last_layer_idx = this.map.layers.length;
                let marine_layer = this.map.findLayerById('marine_board_facilities_service_layer');
                this.map.reorder(marine_layer, last_layer_idx);

                // mark features as initialized
                this.map.features_loaded = true;

                resolve();
              });

            }
          });
        },
        filterFeatures (filter) {
          let lakes = this.lakes;

          // filter applicable lakes
          if (filter != 'all_lakes') {
              lakes = this.lakes.filter((lake) => {
                  return lake[filter] == true;
              });
          }

          filterClusters(this.map, this.view, lakes);
        },
        initView () {
            this.view = this.mode == 'full' ? this.views.full : this.views.mini;
            if (this.view != null) {
               this.view.goTo({target: this.view.extent, animate: false}).then(() => {
                   console.debug("View object already exists.");
                   return
               });
            }

            return new Promise ((resolve) => {
                this.markTimestamp('esri-view');

                loadModules([
                    "esri/views/MapView",
                    "esri/widgets/Locate",
                ], config.dojo_options).then(([
                    MapView, Locate
                ]) => {
                    let gte = this.getTimeElapsed();
                    console.debug("Loading ESRI view modules took " + gte('esri-view') + "ms");

                    this.view = new MapView({
                        map: this.map,
                        container: 'esri-map',
                        zoom: this.zoom,
                        center: config.map_center
                    });

                    let dimension = this.view.width + "x" + this.view.height;
                    console.debug("Created map view with dimensions " + dimension);

                    if (this.mode == 'full') {
                        // we're using custom controls
                        let locateWidget = new Locate({
                            viewModel: {view: this.view},
                            goToLocationEnabled: false,  // otherwise it starts immediately?
                            declaredClass: 'aol-locate-widget'
                        });
                        this.view.ui.components = [locateWidget];
                    }

                    this.view.constraints = {
                        minZoom: config.minZoom,
                        maxZoom: config.maxZoom,
                        snapToZoom: false,
                        rotationEnabled: false
                    };
                    this.view.when().then(()=> {
                        this.setMapView({type: this.mode, view: this.view})

                        // bounds checking is configurable in map config module
                        if (config.checkBounds) {
                            let initialExtent = this.view.extent.clone();
                            this.view.on('drag', () => {checkExtent(this.view, initialExtent)});
                            this.view.on('key-down', (e) => {
                                const arrow_keys = [
                                    'ArrowDown',
                                    'ArrowUp',
                                    'ArrowRight',
                                    'ArrowLeft'
                                ];
                                if (arrow_keys.indexOf(e.key > -1)) {
                                    checkExtent(this.view, initialExtent);
                                }
                            });
                        }
                    });

                    resolve();

                });  // end loadModules
            });  // end Promise
        },  // end initView
        initMap () {
            if (this.map != null) {
                return new Promise ((resolve) => {
                    console.debug("Map object already exists.");
                    resolve();
                });
            }

            return new Promise ((resolve) => {
                this.markTimestamp('esri-map');

                loadModules([
                    "esri/Map",
                    "esri/identity/IdentityManager",
                ], config.dojo_options).then(([
                      EsriMap, IdentityManager
                ]) => {
                    let gte = this.getTimeElapsed();
                    console.debug("Loading ESRI map modules took " + gte('esri-map') + "ms");

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

                        let map = new EsriMap({basemap: this.basemap});
                        this.setMapObject(map);

                        // TODO: The following utilities load layers which are hosted
                        //       as secure (i.e., private) data sources. Such data sources
                        //       are incompatible with app-based logins.
                        this.markTimestamp('esri-tile-layers');
                        Promise.all([
                            // NOTE: temporarily remove custom baselayers
                            // createNLCDTileLayer(this.map),
                            createVectorTileLayers(this.map),
                        ]).then(() => {
                            let gte = this.getTimeElapsed();
                            console.debug("Loading map tile layers took " + gte('esri-tile-layers') + "ms");
                        }).catch((e) => {
                            this.setError(app_config.ERROR_TYPES.APP);
                            console.error(e)
                        })

                        resolve();

                    }).catch((e) => {
                        this.setError(app_config.ERROR_TYPES.APP);
                        console.error(e)
                    }); // end getAuthToken
                }).catch((e) => {
                  this.setError(app_config.ERROR_TYPES.APP);
                  console.error(e)
                }); // end loadModules
            }); // end Promise
        }, //end initMap
    }, // end methods
    watch: {
        zoom: function(val) {
            if (parseFloat(this.view.zoom) != val) {
                this.setIntroDismissed(true);
                this.view.zoom = val;
            }
        },
        filter: function(val) {
            this.setIntroDismissed(true);
            this.filterFeatures(val);
        },
        currentFocus: function() {
            this.initBounds();
        },
        focus: function() {
            this.initBounds();
       }
    },
    mounted () {
        this.$nextTick(() => {
          this.setLoading(true);

          // initialize map context
          this.initMap().then(() => {

              // initialize map viewport
              this.initView().then(() => {
                  this.setLoading(false);

                  // load feature layers
                  this.loadFeatures().then(() => {

                      // registers click event to select features from map
                      this.view.on('click', (event) => this.onClick(event));

                      // registers watcher for zoom level to update data store
                      // and to recompute clusters.
                      this.view.watch('zoom', (zoom) => {
                          this.setMapZoom(parseFloat(zoom));
                      });

                      // registers watcher for extent changes in order to update
                      // the resultant lake point clustering layer
                      this.view.watch('extent', () => {
                          updateClusters(this.map, this.view).catch((e) => {
                              this.setError(app_config.ERROR_TYPES.MAP)
                              console.error(e)
                        })
                      });

                      this.initBounds();

                    // error handling: loadFeatures
                    }).catch((err) => {
                        this.setError(app_config.ERROR_TYPES.APP);
                        console.error(err)
                    });

                // error handling: initView
                }).catch((err)=> {
                    this.setError(app_config.ERROR_TYPES.APP);
                    console.error(err)
                });

            // error handling: initMap
            }).catch((err)=> {
                this.setError(app_config.ERROR_TYPES.APP);
                console.error(err)
            });
        });
    }, // end mounted
}
</script>

<style lang="scss" scoped>
.map {
  animation: fade-in 1000ms forwards;
}
</style>
