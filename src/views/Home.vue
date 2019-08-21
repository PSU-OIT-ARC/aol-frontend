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
import { mapActions, mapGetters } from 'vuex';

import MapContainer from '@/components/map/MapContainer';
import SideBar from '@/components/SideBar';

export default {
  name: 'home',
  components: {
    MapContainer,
    SideBar
  },
  methods: {
    ...mapActions(['setCurrentFocus', 'fitBounds']),
    ...mapGetters(['getLakeByReachcode']),
    activateLake (lake) {
      this.setCurrentFocus(lake);
      this.fitBounds({lake: lake });
      this.$router.push({name: 'home', query: {'lake': lake.reachcode}});
    },
    deactivateLake () {
      this.setCurrentFocus();
      this.fitBounds({});
      this.$router.push({name: 'home', query: {}});
    },
  },
  computed: {
    ...mapGetters(['getCurrentFocus']),
  },
  watch: {
    '$route': function (to) {
      if (to.name == "home" && to.query && Object.keys(to.query).includes("lake")) {
        let gl = this.getLakeByReachcode();
        let lake = gl(parseInt(to.query.lake));
        this.activateLake(lake);
      } else if (to.name == "home" && to.query && !Object.keys(to.query).length) {
        this.deactivateLake();
      }
    }
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
