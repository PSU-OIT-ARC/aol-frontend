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
  display: grid;
  grid-area: sidebar;

  @include respond-to(handheld) {
    position: absolute;
  }
}

</style>
