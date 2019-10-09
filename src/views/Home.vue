<template>
  <div v-bind:class="[focus ? 'sidebar_active' : '', 'home']">
    <side-bar class='sidebar-wrapper'
      v-bind:class="[focus ? 'sidebar_active' : '']">
    </side-bar>
    <map-container v-bind:class="[focus ? 'sidebar_active' : '']"
                   class='map-wrapper'></map-container>
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
                   'setMapFocus',
                   'focusLake',
                   'resetSearchResults']),
    initializeMap (query) {
      this.focusLake(query.lake);

      if (query.lake) {
        this.setIntroDismissed(true);
      }
    }
  },
  watch: {
    '$route': function (to) {
      this.initializeMap(to.query);
    },
    lakes: function() {
      // lakes will only be loaded once per session, so
      // this watch callback will only be triggered on
      // initial view load, highly likely before user input.
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
  grid-template-columns: 0 auto;
  grid-template-areas: "sidebar map";
  @include respond-to(handheld) {
    grid-template-areas: "map sidebar";
    grid-template-rows: auto 0;
  }

  width: 100vw;
  height: $map_desktop_height;
  @include respond-to(handheld) {
    height: auto;
  }

  overflow: hidden;
}

</style>
