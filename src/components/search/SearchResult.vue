<template>
  <div id="search-result">
    <a href="#"
      @click="setCurrentLake(lake)">
      {{ lake.name }}
    </a>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'search-result',
  props: ['lake'],
  methods: {
    ...mapActions(['setCurrentLake']),
  }
}
</script>

<style scoped lang="scss">
  #search-result {
    color: #333;
    height: 15vh;
    background: #f3f3f3;
    padding: 10px;
    margin: 10px 0px;
  }
</style>
