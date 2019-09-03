<template>
  <div v-bind:class="[focus ? 'sidebar_active' : '', 'home']">
    <intro-card/>
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
import IntroCard from '@/components/IntroCard';

export default {
  name: 'home',
  components: {
    MapContainer,
    SideBar,
    IntroCard
  },
  computed: {
    ...mapGetters({lakes: 'getLakes', focus: 'getCurrentFocus'}),
  },
  methods: {
    ...mapActions(['resetBounds', 'focusLake']),
  },
  watch: {
    '$route': function (to) {
      if (to.name == "home" && to.query && Object.keys(to.query).includes("lake")) {
        this.focusLake(to.query.lake);
      } else if (to.name == "home" && to.query && !Object.keys(to.query).length) {
        this.focusLake(null);
      }
    },
    lakes: function() {
      this.focusLake(this.$route.query.lake);
    }
  },
  created () {
    this.focusLake(this.$route.query.lake);
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
