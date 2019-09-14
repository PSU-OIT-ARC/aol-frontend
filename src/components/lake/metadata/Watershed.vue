<template>
  <div class="map-image--wrapper">
    <div class='inner'>
      <a name="watershed" id="watershed"></a>
      <map-loader :mode='"embedded"'/>
      <aol-map ref="map" :mode='"mini"' :small='true'></aol-map>
    </div>
    <p class="caption">
      <!-- <a href="#">Lake</a>|<a href="#">Watershed</a> -->
    </p>
  </div>
</template>

<script>
  import AolMap from '@/components/map/AolMap';
  import MapLoader from '@/components/map/MapLoader';

  export default {
    name: 'watershed',
    title: 'Watershed',
    components: { AolMap, MapLoader },
  }
</script>

<style scoped lang='scss'>

.map-image--wrapper {
  margin: auto;
  .inner {
    position: relative;
    background-image: url("~@/assets/generic_thumb_square.png");
  }
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
