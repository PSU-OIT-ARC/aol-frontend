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
  position: absolute;
  top: 20;
  left: 0;

  width: 100%;
  height: 100%;
  z-index: 99999;
  background: rgba(222, 222, 222, 0.3);
  font-weight: bold;

  div.full {
    position: relative;
    text-align: center;
    top: 80%;
  }
  div.embedded {
    position: relative;
    text-align: center;
    top: 40%;
  }
}

</style>
