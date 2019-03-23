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
import AolOLMap from '@/components/map/AolOLMap';
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

<style lang="scss" scoped>



</style>
