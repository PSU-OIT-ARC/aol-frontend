<template>
  <div class="home">
    <search-pane></search-pane>
    <AolMap></AolMap>
  </div>
</template>

<script>
// @ is an alias to /src
import AolMap from '@/components/AolMap.vue';
import SearchPane from '@/components/search/SearchPane';


export default {
  name: 'home',
  components: {
    AolMap,
    SearchPane
  },
}
</script>
