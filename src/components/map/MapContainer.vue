<template>
  <div class='map-container'>
    <map-loader class="full" :mode='"full"'/>
    <aol-map ref="map" :mode='"full"' :small='false'></aol-map>

    <div v-show="active_state.legend" class="map-legend-wrapper">
      <a class="close-filters" @click="toggleVisibility('legend')">
        <close-button-svg/>
      </a>
      <h4>Map Legend</h4>
      <img src="~@/assets/temp_legend.png" />
    </div>

    <div class="map-buttons-wrapper">
      <div class="map-buttons">

        <a role="button"
           class="map-button map-button--zoom-in"
           :class="{disabled: zoomInDisabled()}"
           @click="zoomIn">
           <zoom-in-svg/>
        </a>
        <a role="button"
           class="map-button map-button--zoom-out"
           :class="{disabled: zoomOutDisabled()}"
           @click="zoomOut">
           <zoom-out-svg/>
        </a>

        <a role="button"
           class="map-button map-button--extent"
           @click="goToInitialExtent">
          <initial-extent/>
        </a>

        <a role="button"
           class="map-button map-button--layers"
           :class="{selected: active_state.filters}"
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
  computed: {
    ...mapGetters({zoom: 'getMapZoom'}),
  },
  methods: {
    ...mapActions(['setMapZoom', 'focusMap',
                   'resetSearchResults']),
    zoomIn () {
      if (!this.zoomInDisabled()) {
        // this.setMapZoom(parseFloat(this.zoom) + 0.5);
        this.setMapZoom(parseFloat(this.zoom) + 1.0);
      }

      return false;
    },
    zoomInDisabled () {
      return parseFloat(this.zoom) + 0.5 > parseFloat(config.maxZoom);
    },
    zoomOut () {
      if (!this.zoomOutDisabled()) {
        // this.setMapZoom(parseFloat(this.zoom) - 0.5);
        this.setMapZoom(parseFloat(this.zoom) - 1.0);
      }

      return false;
    },
    zoomOutDisabled () {
      return parseFloat(this.zoom) - 0.5 < parseFloat(config.minZoom);
    },
    toggleVisibility (attr) {
      this.active_state[attr] = !this.active_state[attr];
      return false;
    },
    locate () {
      let view = this.$refs.map.view;
      let locate = view.ui.components.find((component) => {
          return component.declaredClass == 'aol-locate-widget';
      });

      locate.goToLocationEnabled = true;
      locate.locate()
    },
    goToInitialExtent () {
      if (Object.keys(this.$route.query).includes('lake') ||
          Object.keys(this.$route.query).includes('f')) {
            this.$router.push({name: 'home'});
      }

      this.$refs.map.resetBounds();
      this.resetSearchResults();

      return false;
    }
  },
}
</script>

<style lang="scss" scoped>
  .map-container {
    height: $main_desktop_height;
    width: 100%;
    @include respond-to(handheld) {
      width: $sidebar_mobile_width;
    }
  }
  .map-container.sidebar_active {
    @include respond-to(handheld) {
      height: $main_mobile_height;
    }
  }

  a.map-button.disabled {
    background: #ccc;
    cursor: not-allowed;
  }

</style>
