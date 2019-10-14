<template>
  <div class="sidebar-container">
    <search-pane></search-pane>
    <intro-card/>
    <lake-side-bar
        v-if="getCurrentFocus" :lake="getCurrentFocus">
    </lake-side-bar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import LakeSideBar from '@/components/lake/LakeSideBar';
import SearchPane from '@/components/search/SearchPane';
import IntroCard from '@/components/IntroCard';

export default {
  name: 'sidebar',
  computed: {
    ...mapGetters(['getCurrentFocus']),
  },
  components: {
    SearchPane,
    IntroCard,
    LakeSideBar
  }
}
</script>

<style scoped lang='scss'>

  .sidebar-container {
    position: absolute;

    display: grid;
    grid-area: sidebar;

    width: $sidebar_desktop_width;
    height: $sidebar_desktop_height;
    @include respond-to(handheld) {
      width: $sidebar_mobile_width;
    }
  }

  .sidebar-container.sidebar_active {
    @include respond-to(handheld) {
      top: calc(#{$navbar_height} + #{$map_mobile_height});
      height: $sidebar_mobile_height;
    }
  }

</style>
