<template>
  <div class="map-image--wrapper">
    <div class='inner'>
      <a name="watershed" id="watershed"></a>
      <map-loader/>
      <aol-map :small='true' id='map'></aol-map>
      <!--img src="~@/assets/generic_thumb_square.png"-->
    </div>
    <p class="caption">
      <a href="#">Lake</a>|<a href="#">Watershed</a>
    </p>
  </div>
</template>

<script>
  import AolMap from '@/components/map/AolMap';
  import MapLoader from '@/components/map/MapLoader';
  import { mapActions } from 'vuex';

  export default {
    props: ['lake'],
    name: 'watershed',
    title: 'Watershed',
    components: { AolMap, MapLoader },
    methods: {
      ...mapActions(['setCurrentFocus'])
    },
    created () {
      this.setCurrentFocus(this.lake);
    }
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
  text-align: center;
  a {
    padding: 5px;
  }
}
</style>
