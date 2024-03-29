<template>
  <div id='esri-map'
       class='map'
       :class="small ? 'small' : ''">
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import MapView from '@arcgis/core/views/MapView';
import Locate from '@arcgis/core/widgets/Locate';
import { default as EsriMap } from '@arcgis/core/Map';
import IdentityManager from '@arcgis/core/identity/IdentityManager';

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
    prepareExtent
} from '@/components/map/utils';

export default {
    name: 'aol-map',
    props: ['small', 'mode'],
    computed: {
        ...mapGetters({map: 'getMapObject',
                       views: 'getMapView',
                       basemap: 'getMapBasemap',
                       focus: 'getMapFocus',
                       extent: 'getMapExtent',
                       zoom: 'getMapZoom',
                       filter: 'getMapFilter',
                       lakes: 'getLakes',
                       minorLakes: 'getMinorLakes',
                       reachcodes: 'getReachcodes',
                       currentFocus: 'getCurrentFocus',
                       currentLake: 'getCurrentLake'}),
    },
    methods: {
        ...mapGetters(['getTimeElapsed',
                       'getLakeByReachcode']),
        ...mapActions(['markTimestamp', 'setError', 'getAuthToken',
                       'setMapObject', 'setMapView', 'setMapFocus', 'setMapExtent', 'setMapZoom',
                       'setLoading', 'setIntroDismissed',
                       'resetSearchResults', 'fetchLakes']),

        onClick(event) {
            this.view.hitTest(event).then(async (response) => {

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
                        } else if (this.$route.name == 'map' &&
                                   this.$route.query.lake == parseInt(reachcode)) {
                          console.warn("Selection made is the current selection");
                          return
                        }

                        let gl = this.getLakeByReachcode();
                        let lake = gl(parseInt(reachcode));

                        if (lake != undefined && lake != null) {
                          console.debug("Loading waterbody " + reachcode + " from index");
                          await this.$router.push({
                              name: 'map',
                              query: {lake: lake.reachcode}
                          });
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
                if (this.focus == true) {
                    console.debug("Keeping current map extent");
                } else if (this.extent != null) {
                    console.debug("Loading previous (stored) map extent");
                    this.setLoading(true);
                    this.view.goTo(this.extent, {animate: false}).then(() => {
                        this.setLoading(false);
                    });
                } else {
                    this.resetBounds();
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
            this.setLoading(true);
            this.setMapFocus(false);
            this.setMapExtent(null);

            let lake_boundaries_layer = this.map.findLayerById('lake_bbox_service_layer');
            lake_boundaries_layer.when(()=>{
              return lake_boundaries_layer.queryExtent();
            }).then((response) => {
              console.debug("Fitting map bounds to features");
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
                        this.view.goTo({target: extent, animate: false}).then(()=> {
                            let gte = this.getTimeElapsed();
                            console.debug("Fitting for geom took " + gte(tsName) + "ms");
                            this.setLoading(false);

                            if (this.mode == 'full') {
                                this.setMapExtent(this.view.extent);
                                this.setMapFocus(true);
                            }
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
            } else if (!this.reachcodes) {
              console.warn("No lake data is yet available");
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
                    rotationEnabled: config.rotation,
                    geometry: {
                        type: "extent",
                        xmin: config.xmin,
                        ymin: config.ymin,
                        xmax: config.xmax,
                        ymax: config.ymax
                    }
                };
                this.view.navigation.browserTouchPanEnabled = false;
                this.view.when().then(()=> {
                    this.setMapView({type: this.mode, view: this.view})
                });

                resolve();

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

            }); // end Promise
        }, //end initMap
        init () {
            // initialize map context
            this.initMap().then(() => {

                // initialize map viewport
                this.initView().then(() => {

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
                            });
                        });

                        // ???
                        this.view.on('resize', () => {
                            console.debug("View has been resized");
                        });

                        // 
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
        },
        loadData () {
            // load major lake content
            this.fetchLakes('major').then((success, firstFetch) => {

                // if the fetch was successful and this was not the initial
                // load of waterbody data reset search results and reload
                // map features in order to synchronize any data changes.
                if (success && !firstFetch) {
                    //
                    this.resetSearchResults();

                    //
                    if (this.map != null && this.view != null) {
                        this.map.features_loaded = false;
                        this.loadFeatures().then(() => {
                            this.initBounds();
                        });
                    }
                }
            });

            // load minor lake content
            this.fetchLakes('minor').then(() => {});
        }
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
        }
    },
    created () {
        console.debug("Loading waterbody data");
        this.loadData();
    },
    mounted () {
        this.$nextTick(() => {
            this.setLoading(true);
            this.init();
            this.setLoading(false);
        });
    }, // end mounted
    unmounted () {
        console.debug("Unsetting map focus state");
        this.setMapFocus(false);

        console.debug("Storing current map extent");
        this.setMapExtent(this.view.extent);
    }
}
</script>

<style lang="scss" scoped>
  .map {
    position: relative;
    height: 100%;
    width: 100%;

    @include respond-to(handheld) {
      width: 100vw;
    }

    animation: fade-in 1000ms forwards;
    overflow: hidden;
    z-index: 1000;
  }

  .map.small {
    height: calc(#{$minimap_height} + #{$fudge_factor});
    width: calc(#{$minimap_width} + #{$fudge_factor});

    pointer-events: none;
    animation: fade-in 400ms forwards;
  }

  .sidebar_active .map {
    @include respond-to(handheld) {
      height: $map_mobile_height;
    }
  }
</style>
