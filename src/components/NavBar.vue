<template>
  <div id='nav'>

    <h1><a href="/">Atlas <span>of Oregon Lakes</span></a></h1>

    <div class="nav-links">
      <router-link to="/aquatic-invasives">Aquatic Invasives</router-link>
      <router-link to="/about">About</router-link>
    </div>



  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions(['setCurrentLake'])
  }
}
</script>

<style scoped lang='scss'>
#nav {
  position: relative;
  z-index: 3;
  display: grid;
  grid-template-columns: 45% 1fr;
  @include respond-to(handheld) {
    grid-template-columns: 25% 1fr;
  }

  padding: 3px 0px;
  background-color: white;
  text-align: left;

  h1 {
    padding: 0px;
    margin: 0px;
    color: $primary_color;
    font-size: 26px;
    margin-left: 10px;
  }

  .nav-links {
    text-align: right;
    margin-right: 10px;
    margin-top: 8px;
    font-size: 1em;
    @include respond-to(handheld) {
      font-size: .8em;
    }
  }
}

a:link, a:visited {
  color: $primary_color;
  padding: 10px;
  text-decoration: none;

  span {
    color: #666;
    @include respond-to(handheld) {
      display: none;
    }
  }

  &:hover {
    color: lightgray;
  }
}
</style>
