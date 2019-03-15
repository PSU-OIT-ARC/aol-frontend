<template>
  <div id='nav'>

    <h1><router-link
      @click.native="setCurrentLake()"
      to="/">
      Atlas
    </router-link></h1>

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
  padding: 3px 0px;
  background-color: black;
  text-align: left;
  display: grid;
  grid-template-columns: 1fr 1fr;

  h1 {
    padding: 0px;
    margin: 0px;
    color: white;
    font-size: 26px;
    margin-left: 20px;
  }

  .nav-links {
    text-align: right;
    margin-right: 10px;
    margin-top: 8px;
  }
}

a:link, a:visited {
  color: white;
  padding: 10px;
  font-size: 1em;
  text-decoration: none;

  &:hover {
    color: lightgray;
  }
}
</style>
