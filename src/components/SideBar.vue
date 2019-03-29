<template>
  <div class="sidebar">
    <search-pane></search-pane>
    <lake-side-bar
        v-if="getCurrentLake" :lake="getCurrentLake">
    </lake-side-bar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import LakeSideBar from '@/components/lake/LakeSideBar';
import SearchPane from '@/components/search/SearchPane';

export default {
  name: 'sidebar',
  methods: {
    ...mapActions(['setCurrentLake']),
  },
  computed: {
    ...mapGetters(['getCurrentLake']),
  },
  components: {
    LakeSideBar,
    SearchPane
  }
}
</script>

<style scoped lang='scss'>

.sidebar {
  position: relative;
  grid-area: sidebar;

  @include respond-to(handheld) {
    position: absolute;
  }
}

</style>
