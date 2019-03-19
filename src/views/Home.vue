<template>
  <div v-bind:class="[getCurrentLake ? 'sidebar_active' : '', 'home']">
    <side-bar class='sidebar-wrapper'
      v-bind:class="[getCurrentLake ? 'sidebar_active' : '']">
    </side-bar>
    <aol-map class='map-wrapper'></aol-map>
  </div>
</template>

<script>
// @ is an alias to /src
import AolOLMap from '@/components/AolOLMap';
import SideBar from '@/components/SideBar';
import { mapGetters } from 'vuex';

export default {
  name: 'home',
  components: {
    'aol-map': AolOLMap,
    SideBar
  },
  computed: {
    ...mapGetters(['getCurrentLake']),
  },
  created () {
    // set query param to current lake when 'returning' home?
    // alternatively we could clear current_lake
    // when navigating to other pages
    let lake = this.getCurrentLake;
    let hash = this.$route.hash;
    if (lake && !hash) {
      this.$router.push({name: 'home', query: {'lake': lake.slug}})
    }
  }
}
</script>

<style scoped>

  .home {
    display: grid;
    grid-template-columns: 0 1fr; /* sidebar closed on load */
    width: 100vw;
    height: calc(100vh - 42px); /* prefer calc */
    overflow: hidden;
    background-color: lightblue; /* you see this as map tiles load */
  }

  .home.sidebar_active {
    grid-template-columns: 420px 1fr;
  }

  .sidebar-wrapper {
    /* not in use  */
  }

</style>
