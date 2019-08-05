<template>
  <div v-bind:class="[getCurrentFocus ? 'sidebar_active' : '', 'home']">
    <side-bar class='sidebar-wrapper'
      v-bind:class="[getCurrentFocus ? 'sidebar_active' : '']">
    </side-bar>
    <map-container class='map-wrapper'></map-container>
  </div>
</template>

<script>
// @ is an alias to /src
import MapContainer from '@/components/map/MapContainer';
import SideBar from '@/components/SideBar';
import { mapGetters } from 'vuex';

export default {
  name: 'home',
  components: {
    MapContainer,
    SideBar
  },
  computed: {
    ...mapGetters(['getCurrentFocus']),
  }
}
</script>

<style lang="scss" scoped>

.home {
  display: grid;
  grid-template-columns: 0 1fr;
  grid-template-areas: "sidebar map";

  width: 100vw;
  height: calc(100vh - 42px);

  overflow: hidden;
  @include respond-to(handheld) {
    grid-template-areas: "map sidebar";

  }
}

.home.sidebar_active {
  //grid-template-columns: $sidebar_width 1fr;
  @include respond-to(handheld) {
    grid-template-rows: 200px 1fr; /* should use a variable/calc? */

  }
}

</style>
