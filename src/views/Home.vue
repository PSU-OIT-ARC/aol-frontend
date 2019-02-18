<template>
  <div class="home">
    <side-bar></side-bar>
    <AolMap></AolMap>
  </div>
</template>

<script>
// @ is an alias to /src
import AolMap from '@/components/AolMap';
import SideBar from '@/components/SideBar';

export default {
  name: 'home',
  components: {
    AolMap,
    SideBar
  },
}
</script>
