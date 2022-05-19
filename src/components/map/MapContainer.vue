<template>
  <div class='map-container' v-bind:class="[!isOnline() ? 'offline': '']">
    <map-loader v-show="isOnline()" class="full" :mode='"full"'/>
    <aol-map v-show="isOnline()" ref="map" :mode='"full"' :small='false'></aol-map>

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
           aria-label="Zoom in"
           class="map-button map-button--zoom-in"
           :class="{disabled: zoomInDisabled()}"
           @click="zoomIn">
           <zoom-in-svg/>
        </a>
        <a role="button"
           aria-label="Zoom out"
           class="map-button map-button--zoom-out"
           :class="{disabled: zoomOutDisabled()}"
           @click="zoomOut">
           <zoom-out-svg/>
        </a>

        <a role="button"
           aria-label="Reset view"
           class="map-button map-button--extent"
           @click="goToInitialExtent">
          <initial-extent/>
        </a>

        <a role="button"
           aria-label="Select base layers and filters"
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
import LayerSVG from '@/components/map/controls/LayerSVG';
// import LegendSVG from '@/components/map/controls/LegendSVG';
import ZoomInSVG from '@/components/map/controls/ZoomInSVG';
import ZoomOutSVG from '@/components/map/controls/ZoomOutSVG';
import InitialExtent from '@/components/map/controls/InitialExtent';
import LayerSwitcher from '@/components/map/controls/LayerSwitcher';
import FilterControl from '@/components/map/controls/FilterControl';
import MapLoader from '@/components/map/MapLoader'
import AolMap from '@/components/map/AolMap';

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
    // 'legend-svg': LegendSVG,
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
    async goToInitialExtent () {
      if (Object.keys(this.$route.query).includes('lake') ||
          Object.keys(this.$route.query).includes('f')) {
            await this.$router.push({name: 'map'});
      }

      this.$refs.map.resetBounds();
      this.$refs.map.loadData();
      this.resetSearchResults();

      return false;
    },
    isOnline () {
      return navigator.onLine;
    }
  },
}
</script>

<style lang="scss" scoped>
  .map-container {
    display: grid;
    grid-area: map;

    height: $map_desktop_height;
    width: 100%;
    @include respond-to(handheld) {
      width: $sidebar_mobile_width;
    }
  }

  .map-container.offline {
    background-image: url("~@/assets/generic_thumb_square.png");
  }

  .map-container.sidebar_active {
    @include respond-to(handheld) {
      height: $map_mobile_height;
    }
  }

  .map-buttons-wrapper {
    /*contains the buttons AND the button stage */
    display: grid;
    grid-template-columns: 1fr;
    /*display: none;*/

    position: absolute;
    top: 47px;
    right: 15px;
    z-index: 3000;

    width: 350px;
    height: auto;
    padding: 5px 20px;

    @include respond-to(handheld) {
      width: 100vw;
      top: 92px; /* BUTTON-SHIFT below full-width search */
      right: 0px;
    }
  }

  .close-filters {
    text-align: right;
    cursor: pointer;

    position: absolute;
    top: 15px;
    right: 15px;

    svg {
      fill: black;
      width: 15px;
      height: 15px;
    }
    &:hover, &:focus {
      color: black;
    }
  }

  .map-filter-wrapper {
    position: absolute;
    top: 57px;
    right: 65px;
    z-index: 3002;
    width: 300px;
    height: auto;
    border: 1px solid #ccc;
    padding-bottom: 20px;
    background-color: white;
    animation: slide-in 200ms forwards;

    @include respond-to(handheld) {
      top: 42px; /* BUTTON-SHIFT */
      width: 100vw;
      right: 0px;
    }
  }

  .map-legend-wrapper {
    position: absolute;
    top: 57px;
    right: 65px;
    z-index: 3002;
    height: auto;
    width: 300px;
    right: 65px;
    max-height: 75vh;
    overflow-y: scroll;
    border: 1px solid #ccc;
    background-color: white;
    padding: 15px 0px 20px 15px;
    animation: slide-in 200ms forwards;

    @include respond-to(handheld) {
      width: calc(100vw - 15px);
      right: 0px;
      top: 42px;
    }

    h4 {
      margin: 8px 0px 15px 0px;
    }
  }

  .sidebar_active .map-buttons-wrapper {
    @include respond-to(handheld) {
      display: none;
    }
  }

  .map-buttons {
    position: absolute;
    z-index: 3001;
    top: 0px;
    right: -15px;
    width: 51px;
    height: auto;

    @include respond-to(handheld) {
      padding-bottom: 20px;
      top: 5px;
      right: 0px;
    }
  }

  a.map-button {
    position: relative;
    left: 0px;
    display: block;
    padding: 5px 5px 5px 5px;
    margin: 10px 0px;
    width: 24px;
    background-color: white;
    border: 1px solid #aaa;
    text-align: center;
    cursor: pointer;
    text-decoration: none;

    @include respond-to(handheld) {
      padding-bottom: 20px;
      right: 16px;
      height: 10px;
    }

    &:hover {
      background-color: #ccc;
    }
  }


</style>
