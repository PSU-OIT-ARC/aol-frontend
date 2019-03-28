<template>
  <div class='map-container'>
    <vl-map id="map" class="map" ref="map"
      @mounted="initMap"
      @dblclick="zoomToCluster($event)"
      @click="selectLakeFromClick($event)"
      :load-tiles-while-animating="true"
      :load-tiles-while-interacting="true">

      <vl-view
        :zoom.sync="zoom" :center.sync="center"
        :minZoom="6" :maxZoom="15"
        @update:zoom="calculateClusterDistance">
      </vl-view>

      <vl-layer-tile v-for="layer in baseLayers"
        :key="layer.id" :id="layer.id"
        :visible="layer.visible" :extent="layer.extent">
        <vl-source-xyz
          :url="layer.url">
        </vl-source-xyz>
      </vl-layer-tile>

      <vl-layer-vector-tile  v-for="layer in featureLayers"
        :key="layer.id" :id="layer.id" :ref="layer.id"
        :visible="layer.visible" :declutter="true" :zIndex="layer.zIndex"
        @mounted="applyEsriStyles" :extent="layer.extent">
        <vl-source-vector-tile
          :url="layer.getUrl()">
        </vl-source-vector-tile>
      </vl-layer-vector-tile>

      <!-- unknown if we will draw these vectors at all -->
      <!--vl-layer-vector id='boundaries' ref="lake_layer">
        <vl-source-vector :features="lake_polygons" >
          <vl-style-box>
            <vl-style-stroke :color="polygon.stroke" :width="polygon.width"/>
            <vl-style-fill :color="polygon.fill"/>
          </vl-style-box>
        </vl-source-vector>
      </vl-layer-vector-->

      <vl-layer-vector
        id='lake_markers' ref="lake_markers" :zIndex="10"
        :updateWhileAnimating="true"
        :updateWhileInteracting="true"
        @mounted="mountClusterSource">
      </vl-layer-vector>

    </vl-map>

    <div class="filter-layer-controls-container">
      <filter-control
        @filter-change="selectLakesFromFilters">
      </filter-control>
      <layer-switcher
        @feature-layer-change="selectFeatureLayer">
      </layer-switcher>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { applyStyle } from 'ol-mapbox-style';

import config from '@/components/map/config';
import utils from '@/components/map/utils';
import LayerSwitcher from '@/components/map/LayerSwitcher';
import FilterControl from '@/components/map/FilterControl';

import * as proj from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Cluster from 'ol/source/Cluster';

const USE_CLUSTERS = true;

export default {
  name: 'aol-ol-map',
  data () {
    return {
      ...config,
      selectedAttributes: [],
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
    center: {
      get () {
        return proj.fromLonLat(config.map_center, 'EPSG:3857')
      },
      set (newValue) {
        return newValue;
      }
    },
    /* currently not using
    lake_polygons () {
      return  this.lakes.map((lake) => {
        return {
            type: 'Feature',
            properties: {
              name: lake.slug,
              id: lake.reachcode,
            },
            geometry: {
              type: 'Polygon',
              coordinates: [lake.geom.map((coord) => {
                  return proj.fromLonLat([coord[1], coord[0]], 'EPSG:3857')
              })]
            }
          }
      });
    },
    */
    lake_markers () {
      // only read from GeoJSON once
      if (!this.lakes_with_geom) {
        this.lakes_with_geom = this.getLakeMarkers();
      }
      return this.lakes_with_geom;
    },
  // end computed
  },
  methods: {
    ...mapActions([
      'fetchLakes', 'setCurrentLake', 'fitBounds',
      'searchLakes', 'setMapObject'
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
    selectFeatureLayer (selected_layer) {
      let layers = this.map.$map.getLayers().getArray();
      let feature_layers = layers.filter((layer) => {
          let id = layer.getProperties().id;
          return id == 'nopubland' || id == 'publand';
      });
      utils.selectFeatureLayer(selected_layer, feature_layers);
    },
    getLakeMarkers () {
      if(!this.lakes.length) return;
      let lakes = this.lakes;
      if (USE_CLUSTERS) {
        // Add a bunch of dummy points to test clustering
        let others = [];
        for (let i = 0; i < 5000; i++) {
          let other = Object.assign({}, this.lakes[i%3]);
          let center = this.lakes[i%3].center.map((c) => {
            return c + 1.1 * (0.4-Math.random())
          });
          other.center = center;
          other.has_plants = Math.random() > 0.3 ? true : false;
          others.push(other);
        };
        lakes = this.lakes.concat(others)
      }
      let getId = function () {
        return this.id
      };
      lakes = lakes.map((lake) => {
        return {
            type: 'Feature',
            properties: {
              name: lake.slug,
              id: lake.reachcode,
              has_plants: Math.random() > 0.5 ? true : false,
              has_docs:  Math.random() > 0.4 ? true : false,
            },
            geometry: {
              type: 'Point',
              coordinates: proj.fromLonLat(
                [lake.center[1], lake.center[0]], 'EPSG:3857')
            }
          }
      });
      let geoJSONObj = {};
      geoJSONObj.type = 'FeatureCollection'
      geoJSONObj.features = lakes;
      return new GeoJSON().readFeatures(geoJSONObj)
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
    selectLakesFromFilters (filters) {
      let hasFilterAttributes = (lake) => {
        if (!this.selectedAttributes.length) {
          return true
        }
        let lake_object = lake.getProperties()
        let attr =  this.selectedAttributes.every(
          (attribute) => {
            return lake_object[attribute] == true
        });
        return attr;
      };
      this.selectedAttributes = filters;
      this.lake_marker_source.clear();
      let filtered_lakes = this.lake_markers.filter((lake) => {
        return hasFilterAttributes(lake);
      });
      this.lake_marker_source.addFeatures(filtered_lakes)
    },
    calculateClusterDistance (zoom) {
      if (USE_CLUSTERS) {
        let distance = zoom > config.cluster_max_zoom ? 0 : config.cluster_distance;
        this.cluster_source.setDistance(distance);
      }
    },
    applyEsriStyles (component) {
      let layer = this.featureLayers.find(
        l => l.id == component.$layer.getProperties().id);
      let style_url = layer.getStyleUrl();
      let sprite_url = layer.getSpriteUrl();

      fetch(style_url).then((response)=>{
        return response.json()
      }).then((style) => {
        if (layer.id != 'bathymetry') {
          // HACK: zoom seems to be off from styles min/maxzoom?
          // issue with ol-mapboxstyle and/or OL zoom (integer vs float)
          style.layers.map((layer) => {
            layer.minzoom = Math.floor(layer.minzoom);
            layer.maxzoom = Math.ceil(layer.maxzoom);
          });
          applyStyle(component.$layer, style, 'esri', sprite_url);
        }
        else {
        /*
        HACK: ol-mapboxstyle throws an error if sprite url returns an
        empty object; set sprite to null so it doesn't look for sprites
        */
          style.sprite = null;
          applyStyle(component.$layer, style, 'esri', sprite_url);
        }
      });
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
    initMap () {
      this.map = this.$refs.map;
      this.setMapObject(this.map);

      if(!this.lakes.length) {
        this.fetchLakes().then(()=> {
          this.selectLakeFromUrl();
        });
      }
      else {
        console.log('I already have the lakes. I will not fetch them again');
        this.selectLakeFromUrl();
      }
    }
    // end methods
  },
}
</script>

<style lang="scss" scoped>

  .map {
    overflow: hidden;
    position: relative;
    height: 100%;
    max-height: 100vh;
    grid-area: sidebar;
    @include respond-to(handheld) {
      width: 100vw;
    }
  }

  .filter-layer-controls-container {
    width: 600px;
    height: 40px;
    position: absolute;
    bottom: 40px;
    right: 20px;
    background: white;
    z-index: 1001;
    padding: 5px 20px;
    display: grid;
    grid-template-columns: auto auto;
  }

</style>
