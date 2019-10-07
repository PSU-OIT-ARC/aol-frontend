<template>
  <div v-if="getIsLoading" class="map-loader">
   <div :class="mode">
     <img src="~@/assets/aol-loader.gif" />
   </div>
 </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'map-loader',
  props: ['mode'],
  computed: {
    ...mapGetters(['getIsLoading']),
  }
}
</script>

<style scoped lang='scss'>
  .map-loader {
    width: 100%;

    z-index: 1999;
    background: rgba(192, 192, 192, 0.25);
    font-weight: bold;
  }

  .map-loader.full {
    position: absolute;
    top: $navbar_height;
    left: 0;

    height: calc(100% - #{$navbar_height});
    width: 100%;

    div {
      position: relative;
      text-align: center;
      top: 80%;

      @include respond-to(handheld) {
        top: 40%;
      }
    }
  }
  .sidebar_active .map-loader.full {
    left: $sidebar_desktop_width;
    width: calc(100% - #{$sidebar_desktop_width});

    @include respond-to(handheld) {
      left: 0px;
      height: $map_mobile_height;
      width: $sidebar_mobile_width;
    }
  }

  .map-loader.embedded {
    height: 100%;

    div {
      position: relative;
      text-align: center;
      top: 40%;
    }
  }
</style>
