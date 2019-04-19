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

        <a role="button" href="#" class="map-button map-button--zoom-in"
           @click="zoomIn">
          +
        </a>
        <a role="button" href="#" class="map-button map-button--zoom-out"
           @click="zoomOut">
          -
        </a>

        <a role="button" href="#" class="map-button map-button--layers"
           v-bind:class="{ selected: show_filters}"
           @click="show_filters = !show_filters; show_legend = false">
          <layer-svg/>
        </a>

        <a role="button" href="#" class="map-button map-button--legend"
           v-bind:class="{ selected: show_legend}"
           @click="show_legend = !show_legend; show_filters = false">
          <legend-svg/>
        </a>

      </div>
    </div>

    <div class="map-filter-wrapper" v-if="show_filters == true">

      <layer-switcher @show_filters="toggleFilters" />

      <filter-control
        :lake_markers="lake_markers" :lake_markers_layer="lake_markers_layer">
      </filter-control>

    </div>

  </div>
</template>


<script>

import AolMap from '@/components/map/AolMap';
import LayerSVG from '@/components/map/controls/LayerSVG';
import LegendSVG from '@/components/map/controls/LegendSVG';
import LayerSwitcher from '@/components/map/controls/LayerSwitcher';
import FilterControl from '@/components/map/controls/FilterControl';


export default {
  name: 'map-container',
  data () {
    return {
      selectedAttributes: [],
      show_filters: false,
      show_legend: false,
      lake_markers: [],
      lake_markers_layer: null
    }
  },
  components: {
    'layer-svg': LayerSVG,
    'legend-svg': LegendSVG,
    LayerSwitcher,
    FilterControl,
    AolMap
  },
  methods: {
    setLakeMarkersLayer (layer) {
      this.lake_markers = layer.markers;
      this.lake_markers_layer = layer.layer;
    },
    zoomIn () {
      const view = this.$store.state.map_view;
      view.zoom += 1;
    },
    zoomOut () {
      const view = this.$store.state.map_view;
      view.zoom -= 1;
    },
    toggleFilters (toggle_filters) {
      this.show_filters = toggle_filters;
      this.show_legend = false;
    },
  }
}
</script>

<style lang="scss" scoped></style>
