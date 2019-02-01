<style lang="scss">
  @import './styles/application';
</style>

<template>
  <div id="app">
    <nav-bar></nav-bar>
    <router-view/>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';

export default {
  name: 'app',
  components: { NavBar }
}
</script>

<style lang="scss">

</style>
