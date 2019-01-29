<template>
  <div id="app">
    <nav-bar></nav-bar>
    <search-pane></search-pane>
    <router-view/>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import SearchPane from '@/components/search/SearchPane';

export default {
  name: 'app',
  components: {
    NavBar,
    SearchPane
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $font-white;
}

</style>
