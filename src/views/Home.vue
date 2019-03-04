<template>
  <div v-bind:class="[getCurrentLake ? 'sidebar_active' : '', 'home']">
    <side-bar class='sidebar-wrapper'
      v-bind:class="[getCurrentLake ? 'sidebar_active' : '']">
    </side-bar>
    <AolMap class='map-wrapper'>
    </AolMap>
  </div>
</template>

<script>
// @ is an alias to /src
import AolMap from '@/components/AolMap';
import SideBar from '@/components/SideBar';
import { mapGetters } from 'vuex';

export default {
  name: 'home',
  components: {
    AolMap,
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
    width: 100vw;
    height: 92vh;
    overflow: hidden;
    display: grid;
    grid-template-columns: 0 1fr;
  }

  .home.sidebar_active {
    grid-template-columns: minmax(400px, 35%) auto;
  }

  .sidebar-wrapper {
    background: white;
  }

</style>
