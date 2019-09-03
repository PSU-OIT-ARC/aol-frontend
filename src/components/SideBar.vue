<template>
  <div class="sidebar">
    <search-pane></search-pane>
    <lake-side-bar
        v-if="getCurrentFocus" :lake="getCurrentFocus">
    </lake-side-bar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import LakeSideBar from '@/components/lake/LakeSideBar';
import SearchPane from '@/components/search/SearchPane';

export default {
  name: 'sidebar',
  computed: {
    ...mapGetters(['getCurrentFocus']),
  },
  components: {
    LakeSideBar,
    SearchPane
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
