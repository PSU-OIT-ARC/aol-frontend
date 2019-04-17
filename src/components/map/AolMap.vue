<template>
  <div class='map-container'>

    <div id="map" class="map"></div>

    <div v-if="show_legend == true" class="map-legend-wrapper">
      <h4>Map Legend</h4>
      <div class="close-filters" @click="show_legend = false">╳</div>
      <img src="~@/assets/temp_legend.png" />
    </div>

    <div class="map-buttons-wrapper">
      <div class="map-buttons">
        <a role="button" href="#"
        v-bind:class="['map-button map-button--layers', { selected: show_filters}]" @click="show_filters = !show_filters; show_legend = false">
          <svg width="20px" height="22px" viewBox="0 0 20 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <path d="M9.98888889,18.3777778 L1.8,12.0111111 L0,13.4111111 L10,21.1888889 L20,13.4111111 L18.1888889,12 L9.98888889,18.3777778 L9.98888889,18.3777778 Z M10,15.5555556 L18.1777778,9.18888889 L20,7.77777778 L10,0 L0,7.77777778 L1.81111111,9.18888889 L10,15.5555556 L10,15.5555556 Z" id="Shape" fill="#555555"></path>
            </g>
          </svg>
        </a>

        <a role="button" href="#" class="map-button map-button--legend"
v-bind:class="['map-button map-button--legend', { selected: show_legend}]" @click="show_legend = !show_legend; show_filters = false">
          <svg width="3px" height="16px" viewBox="0 0 3 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Group-2" fill="#2B2B2B" fill-rule="nonzero">
                    <rect id="Rectangle-2" x="0" y="6" width="3" height="10"></rect>
                    <circle id="Oval-2" cx="1.5" cy="1.5" r="1.5"></circle>
                </g>
            </g>
          </svg>
        </a>
      </div>

    </div>


    <div class="map-filter-wrapper" v-if="show_filters == true">
      <layer-switcher
        @feature-layer-change="selectVectorTileLayer" @show_filters="toggleFilters">
      </layer-switcher>

      <filter-control
        @filter-change="selectLakesFromFilters">
      </filter-control>
    </div>


  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import '@/esri_dojo_workers';
import Map from "esri/Map";
import MapView from "esri/views/MapView";
import VectorTileLayer from "esri/layers/VectorTileLayer";
import TileLayer from "esri/layers/TileLayer";
import IdentityManager from "esri/identity/IdentityManager";
import FeatureLayer from "esri/layers/FeatureLayer";
import Graphic from "esri/Graphic";

import config from '@/components/map/config';
import utils from '@/components/map/utils';
import LayerSwitcher from '@/components/map/LayerSwitcher';
import FilterControl from '@/components/map/FilterControl';

const USE_CLUSTERS = true;

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
  components: {
    LayerSwitcher,
    FilterControl
  },
  computed: {
    ...mapGetters({
        lakes: 'getLakes',
        getLakeBySlug: 'getLakeBySlug'
      },
      'getCurrentLake'
    ),
  },
  methods: {
    ...mapActions([
      'fetchLakes', 'setCurrentLake', 'fitBounds',
      'searchLakes', 'setMapObject', 'setMapNode'
    ]),
    zoomToCluster: utils.zoomToCluster,
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
    },
    selectVectorTileLayer (selected_layer) {
      let layers = this.map.allLayers;
      let toggleable_layers = layers.filter((layer) => {
          let id = layer.id;
          return id == 'nopubland' || id == 'publand';
      });
      toggleable_layers.forEach((layer) => {
        if (layer.id != selected_layer) {
            layer.visible = false;
        }
        else if (layer.id == selected_layer) {
          layer.visible = true;
        }
      });
    },
    selectLakeFromClick (e) {
      console.log(e.map.getCoordinateFromPixel(e.pixel)); // DEBUG
      let feature = utils.checkMarkerOrBounds(
          e, ['lake_markers'], USE_CLUSTERS
      );
      if (feature) {
        let lake = this.getLakeBySlug(feature.getProperties().name);
        this.showSideBar(lake);
      }
    },
    selectLakesFromFilters (filter) {
      // this will need to change to using a query
      // if using a feature layer service in the future
      if(!filter) return;
      let filtered_lakes = this.lake_markers.filter((lake) => {
        return lake.attributes[filter] == true
      });
      this.lake_markers_layer.applyEdits({
        addFeatures: filtered_lakes,
        deleteFeatures: this.lake_markers,
      }).then((results) => {
        console.log(results);
      }).catch((error) => {
          console.log('error: ' + error)
      })
    },
    calculateClusterDistance (zoom) {
      if (USE_CLUSTERS) {
        let distance = zoom > config.cluster_max_zoom ? 0 : config.cluster_distance;
        this.cluster_source.setDistance(distance);
      }
    },
    mountClusterSource (component) {
      // setting cluster source and stylefunction directly in
      // OpenLayers improves performance over Vuelayers component
      let source = new VectorSource({
        features: this.lake_markers
      });
      this.lake_marker_source = source;

      if (USE_CLUSTERS) {
        let cluster_source = new Cluster({
          distance: this.cluster_distance,
          source: source,
        });
        this.cluster_source = cluster_source;
        component.$layer.setSource(cluster_source);

        let clusterStyleFunc = (feature, resolution) => {
            let style = config.pointStyle;
            let size = feature.get('features').length
            if (size > 1) {
              style = config.clusterStyle;
              let text = size == 1 ? '' : size.toString();
              style.text_.text_ = text;
              let radius = utils.mapToRange(size, 2, 2000, 10, 34);
              style.image_.setRadius(radius);
            }
            return style
        };
        component.$layer.setStyle(clusterStyleFunc)
      }
      else {
        component.$layer.setSource(source);
        component.$layer.setStyle(config.pointStyle)
      }
    },
    toggleFilters (toggle_filters) {
      this.show_filters = toggle_filters;
      show_legend = false;
    },
    getLakeMarkers () {
      if(!this.lakes.length) return;
      let lakes = this.lakes;
      if (USE_CLUSTERS) {
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
        lakes = lakes.concat(others)
      }
      lakes = lakes.map((lake) => {
        return {
            attributes: {
              name: lake.slug,
              id: lake.reachcode,
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
          objectIdField: "id",
      });
      this.lake_markers = lakes;
      this.lake_markers_layer = layer;
      this.map.add(layer)
      // NOTE: To execute a query against all the features in a Feature Service
      // rather than only those in the client, you must use the
      // FeatureLayer.queryFeatures() method.
      /*
      layer.queryFeatures().then(function(results){
        console.log('layer.queryFeatures' + results.features);
      });
      this.view.whenLayerView(layer).then(function(layerView) {
        var query = layer.createQuery();
        layerView.queryFeatures(query).then((r)=>{
          console.log(r)
        });
      });
      */
    },
    initMap () {
      // TODO: get token from backend
      IdentityManager.registerToken({
        'server': config.ArcGisOnlineTilesUrl,
        'token': config.token
      });

      if(!this.lakes.length) {
        this.fetchLakes().then(()=> {
          this.selectLakeFromUrl();
        });
      }
      else {
        console.log('I already have the lakes. I will not fetch them again');
        this.selectLakeFromUrl();
      }

      let map = new Map({
          basemap: 'gray'
      });
      let view = new MapView({
          map: map,
          container: "map",
          zoom: config.zoom,
          center: config.map_center
      });
      view.ui.components = [];
      let nlcd = config.baseLayers[1];
      let nlcd_layer = new TileLayer({
          url: nlcd.url
      });
      map.add(nlcd_layer);

      config.featureLayers.forEach((layer) => {
        let vector_tile_layer = new VectorTileLayer({
          url: layer.getLayerUrl(),
          id: layer.id,
          visible: layer.visible
        })
        map.add(vector_tile_layer);
      });
      this.setMapObject(map);
      this.setMapNode(this.$refs.map)
      this.map = map;
      this.view = view;
    }
    // end methods
  },
  mounted () {
    // avoid re-rendering map when using client-side routing.
    if (this.$store.state.map_node == null) {
      this.initMap();
    }
    else {
      this.map = this.$store.state.map_object; // this is for hot reloads
      this.$refs.map.appendChild(this.$store.state.map_node)
    }

    if(!this.lakes.length) {
      this.fetchLakes().then(()=> {
        this.selectLakeFromUrl();
        this.getLakeMarkers();
      });
    }
    else {
      console.log('I already have the lakes. I will not fetch them again');
      this.selectLakeFromUrl();
      this.getLakeMarkers();
    }
  }
  // end mounted
}
</script>

<style lang="scss" scoped></style>
