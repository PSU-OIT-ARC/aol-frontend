<template>
  <div class='map-container'>
    <map-loader/>
    <aol-map></aol-map>

    <div v-if="show_legend == true" class="map-legend-wrapper">
      <h4>Map Legend</h4>
      <div class="close-filters" @click="show_legend = false">╳</div>
      <img src="~@/assets/temp_legend.png" />
    </div>

    <div class="map-buttons-wrapper">
      <div class="map-buttons">

        <a role="button" href="#" class="map-button map-button--zoom-in"
           @click="zoomIn">
           <zoom-in-svg/>
        </a>
        <a role="button" href="#" class="map-button map-button--zoom-out"
           @click="zoomOut">
           <zoom-out-svg/>
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

        <a role="button" href="#"
           class="map-button map-button--locate"
           @click="locate">
           &#8982;
        </a>
      </div>
    </div>

    <div class="map-filter-wrapper" v-show="show_filters == true">

      <layer-switcher @show_filters="toggleFilters" />

      <filter-control/>

    </div>

  </div>
</template>


<script>
import AolMap from '@/components/map/AolMap';
import MapLoader from '@/components/map/MapLoader'
import LayerSVG from '@/components/map/controls/LayerSVG';
import LegendSVG from '@/components/map/controls/LegendSVG';
import ZoomInSVG from '@/components/map/controls/ZoomInSVG';
import ZoomOutSVG from '@/components/map/controls/ZoomOutSVG';
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
    'zoom-in-svg': ZoomInSVG,
    'zoom-out-svg': ZoomOutSVG,
    LayerSwitcher,
    FilterControl,
    AolMap,
    MapLoader
  },
  methods: {
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
    locate () {
      const view = this.$store.state.map_view;
      let locate = view.ui.components.find(
        i => i.declaredClass == 'aol-locate-widget')
      locate.goToLocationEnabled = true;
      locate.locate()
    }
  }
}
</script>

<style lang="scss" scoped></style>
