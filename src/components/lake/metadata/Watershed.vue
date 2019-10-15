<template>
  <div class="map-image--wrapper">
    <a name="watershed" id="watershed"></a>

    <map-loader v-show="isOnline()" class="embedded" :mode='"embedded"'/>
    <aol-map v-show="isOnline()" ref="map" :mode='"mini"' :small='true'></aol-map>
    <p class="caption">
      <!-- <a href="#">Lake</a>|<a href="#">Watershed</a> -->
    </p>
  </div>
</template>

<script>
  import MapLoader from '@/components/map/MapLoader';
  import AolMap from '@/components/map/AolMap';

  export default {
    name: 'watershed',
    title: 'Watershed',
    components: { MapLoader, AolMap },
    methods: {
      isOnline () {
        return navigator.onLine;
      }
    }
  }
</script>

<style scoped lang='scss'>
  .map-image--wrapper {
    position: relative;    

    height: $minimap_height;
    width: $minimap_width;

    margin-bottom: 30px;
    overflow: hidden;

    background-image: url("~@/assets/generic_thumb_square.png");
  }

  .caption {
    display: inline-block;
    margin-bottom: 20px;
    text-align: center;
    a {
      padding: 5px;
    }
  }
</style>
