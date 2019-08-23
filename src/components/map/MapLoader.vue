<template>
  <div v-if="getIsLoading" class="map-loader">
     <div>Loading...</div>
 </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'map-loader',
  computed: {
    ...mapGetters(['getIsLoading'])
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
  z-index: 3;
  background: rgba(222, 222, 222, 0.3);
  font-weight: bold;

  div {
    position: relative;
    top: 40%;
    text-align: center;
  }
}

</style>
