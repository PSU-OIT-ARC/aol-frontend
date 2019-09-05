<template>
  <div class='map-container'>
    <map-loader/>
    <aol-map></aol-map>

    <div v-show="active_state.legend" class="map-legend-wrapper">
      <a class="close-filters" @click="toggleVisibility('legend')">
        <close-button-svg/>
      </a>
      <h4>Map Legend</h4>
      <img src="~@/assets/temp_legend.png" />
    </div>

    <div class="map-buttons-wrapper">
      <div class="map-buttons">

        <a role="button" href="#" class="map-button map-button--zoom-in"
           :class="zoomInDisabled ? 'disabled' : ''"
           @click="zoomIn">
           <zoom-in-svg/>
        </a>
        <a role="button" href="#" class="map-button map-button--zoom-out"
           v-bind:class="zoomOutDisabled ? 'disabled' : ''"
           @click="zoomOut">
           <zoom-out-svg/>
        </a>

        <a role="button" class="map-button map-button--extent"
           @click="goToInitialExtent">
          <initial-extent/>
        </a>

        <a role="button" href="#" class="map-button map-button--layers"
           v-bind:class="{ selected: active_state.filters}"
           @click="toggleVisibility('filters')">
          <layer-svg/>
        </a>

        <!-- <a role="button" href="#"
           class="map-button map-button--locate"
           @click="locate">
           &#8982;
        </a> -->
      </div>
    </div>

    <div class="map-filter-wrapper" v-show="active_state.filters">
      <a class="close-filters" @click="toggleVisibility('filters')">
        <close-button-svg/>
      </a>
      <layer-switcher/>
      <filter-control/>
    </div>

  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import config from '@/components/map/config';

import CloseButtonSVG from '@/components/CloseButtonSVG';
import AolMap from '@/components/map/AolMap';
import MapLoader from '@/components/map/MapLoader'
import LayerSVG from '@/components/map/controls/LayerSVG';
import LegendSVG from '@/components/map/controls/LegendSVG';
import ZoomInSVG from '@/components/map/controls/ZoomInSVG';
import ZoomOutSVG from '@/components/map/controls/ZoomOutSVG';
import InitialExtent from '@/components/map/controls/InitialExtent';
import LayerSwitcher from '@/components/map/controls/LayerSwitcher';
import FilterControl from '@/components/map/controls/FilterControl';

export default {
  name: 'map-container',
  data () {
    return {
      selectedAttributes: [],
      lake_markers: [],
      lake_markers_layer: null,
      active_state: {
        filters: false,
        legend: false,
      }
    }
  },
  components: {
    'close-button-svg': CloseButtonSVG,
    'layer-svg': LayerSVG,
    'legend-svg': LegendSVG,
    'zoom-in-svg': ZoomInSVG,
    'zoom-out-svg': ZoomOutSVG,
    InitialExtent,
    LayerSwitcher,
    FilterControl,
    AolMap,
    MapLoader
  },

  methods: {
    ...mapActions(['resetSearchResults', 'resetBounds']),
    ...mapGetters(['getCurrentZoom']),
    zoomIn () {
      const view = this.$store.state.map_view;
      view.zoom += 0.5;
    },
    zoomOut () {
      const view = this.$store.state.map_view;
      view.zoom -= 0.5;
    },
    toggleVisibility (attr) {
      this.active_state[attr] = !this.active_state[attr];
    },
    locate () {
      const view = this.$store.state.map_view;
      let locate = view.ui.components.find(
        i => i.declaredClass == 'aol-locate-widget')
      locate.goToLocationEnabled = true;
      locate.locate()
    },
    goToInitialExtent () {
        this.$router.push({name: 'home', query: {}});
        this.resetSearchResults();
        this.resetBounds();
    }
  },
  computed: {
    zoomInDisabled () {
      return this.getCurrentZoom() >= config.maxZoom;
    },
    zoomOutDisabled () {
      return this.getCurrentZoom() <= config.minZoom;
    }
  }
}
</script>

<style lang="scss" scoped>
  a.map-button.disabled {
    background: #ccc;
    cursor: not-allowed;

  }

</style>
