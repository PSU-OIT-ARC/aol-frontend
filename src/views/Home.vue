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
    grid-template-columns: minmax(400px, 1000px) auto;
  }

  .sidebar-wrapper {
    background: white;
  }

</style>
