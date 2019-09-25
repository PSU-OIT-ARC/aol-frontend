<template>
  <div class="sidebar">
    <search-pane></search-pane>
    <intro-card/>
    <lake-side-bar
        v-if="getCurrentFocus" :lake="getCurrentFocus">
    </lake-side-bar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

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

.sidebar {
  display: grid;
  grid-area: sidebar;

  @include respond-to(handheld) {
    position: absolute;
  }
}

</style>
