<template>
  <div v-bind:class="[focus ? 'sidebar_active' : '', 'map-view']">
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
  name: 'map',
  components: {
    MapContainer,
    SideBar
  },
  computed: {
    ...mapGetters({lakes: 'getLakes',
                   minorLakes: 'getMinorLakes',
                   focus: 'getCurrentFocus',
                   focusTitle: 'getCurrentFocusTitle'}),
  },
  methods: {
    ...mapActions(['setIntroDismissed',
                   'setMapFocus',
                   'focusLake']),
    initializeMap (query) {
      // 
      this.focusLake(query.lake);

      //
      if (query.lake) {
        this.setIntroDismissed(true);
      }
    }
  },
  watch: {
    '$route': function (to) {
      this.initializeMap(to.query);
    },
    lakes: {
      function() {
        this.initializeMap(this.$route.query);
      },
      deep: true
    },
    minorLakes: {
      function() {
        this.initializeMap(this.$route.query);
      },
      deep: true
    }
  },
  created () {
    this.initializeMap(this.$route.query);
  },
  metaInfo () {
    return {
      title: this.focusTitle || 'Map'
    }
  }
}
</script>

<style lang="scss" scoped>

.map-view {
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
}

</style>
