<template>
  <div class='map-container'>

    <aol-map @layer-ready="setLakeMarkersLayer"></aol-map>

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

import config from '@/components/map/config';
import AolMap from '@/components/map/AolMap';
import LayerSwitcher from '@/components/map/LayerSwitcher';
import FilterControl from '@/components/map/FilterControl';


export default {
  name: 'map-container',
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
    FilterControl,
    AolMap
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
    setLakeMarkersLayer (layer) {
      this.lake_markers = layer.markers;
      this.lake_markers_layer = layer.layer;
    },
    selectLakeFromUrl () {
      let slug = this.$route.query['lake'];
      if (slug) {
        let lake = this.getLakeBySlug(slug);
        this.setCurrentLake(lake);
        this.fitBounds({lake: lake});
      }
    },
    selectVectorTileLayer (selected_layer) {
      let map = this.$store.state.map_object;
      let layers = map.allLayers;
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
    selectLakesFromFilters (filter) {
      /* this will need to change to using a query
      if using a feature layer service in the future
      // like:
      this.view.whenLayerView(layer).then(function(layerView) {
        var query = layer.createQuery();
        layerView.queryFeatures(query).then((r)=>{
          console.log(r)
        });
      });
      // NOTE: To execute a query against all the features in a Feature Service
      // rather than only those in the client, you must use the
      // FeatureLayer.queryFeatures() method.
      */
      if(!filter) return;
      let filtered_lakes = this.lake_markers.filter((lake) => {
        return lake.attributes[filter] == true
      });
      this.lake_markers_layer.applyEdits({
        addFeatures: filtered_lakes,
        deleteFeatures: this.lake_markers,
      }).catch((error) => {
          console.log('error: ' + error)
      })
    },
    toggleFilters (toggle_filters) {
      this.show_filters = toggle_filters;
      this.show_legend = false;
    },
  }
}
</script>

<style lang="scss" scoped></style>
