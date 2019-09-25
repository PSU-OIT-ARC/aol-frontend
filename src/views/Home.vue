<template>
  <div v-bind:class="[focus ? 'sidebar_active' : '', 'home']">
    <side-bar class='sidebar-wrapper'
      v-bind:class="[focus ? 'sidebar_active' : '']">
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
  computed: {
    ...mapGetters({lakes: 'getLakes',
                   focus: 'getCurrentFocus'}),
  },
  methods: {
    ...mapActions(['setIntroDismissed',
                   'focusMap', 'focusLake',
                   'resetSearchResults']),
    initializeMap (query) {
      this.focusMap(query.f);
      this.focusLake(query.lake);

      if (query.f || query.lake) {
        this.setIntroDismissed(true);
      }
    }
  },
  watch: {
    '$route': function (to) {
      this.initializeMap(to.query);
    },
    lakes: function() {
      this.resetSearchResults();
      this.initializeMap(this.$route.query);
    }
  },
  created () {
    this.initializeMap(this.$route.query);
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
