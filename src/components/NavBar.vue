<template>
  <div id="nav">

    <h1><router-link to="/">Atlas <span>of Oregon Lakes</span></router-link></h1>

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
    grid-template-columns: 20% 1fr;
  }
  padding: 3px 0px;
  background-color: white;
  text-align: left;

  h1 {
    padding: 0px;
    margin: 0px;
    color: $primary_color;
    font-size: 26px;
    margin-left: 20px;
    @include respond-to(handheld) {
      margin-left: 15px;
    }
  }

  .nav-links {
    text-align: right;
    margin-right: 15px;
    margin-top: 8px;
    font-size: 1em;

    a {
      margin-left: 25px;
    }

    @include respond-to(handheld) {
      font-size: .8em;
      margin-right: 10px;
    }
  }
}

a.router-link-active {
  border-bottom: 5px $primary_color solid;
  @include respond-to(handheld) {
  }
}

a:link, a:visited {
  color: $primary_color;
  padding-bottom: 6px;
  text-decoration: none;
  margin-left: 0px;

  @include respond-to(handheld) {
    padding-bottom: 10px;
  }

  span {
    color: #666;
    @include respond-to(handheld) {
      display: none;
    }
  }

  &:hover {
    color: #888;
  }
}
</style>
