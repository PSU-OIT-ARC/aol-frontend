<template>
  <div id="nav">

    <div class="site-title">
      <h1><router-link to="/">Atlas <span>of Oregon Lakes</span></router-link></h1>
    </div>

    <div class="nav-links">
      <router-link to="/aquatic-invasives">Aquatic Invasives</router-link>
      <router-link to="/about">About</router-link>
    </div>


    <div class="nav-links--mobile">

      <div role="button" aria-label="menu" v-bind:class="['menu-trigger', { expand: show_menu}]" @click="show_menu = !show_menu">
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="14" viewBox="0 0 21 14">
          <g fill="#06186A">
            <rect width="21" height="2"/>
            <rect width="21" height="2" y="6"/>
            <rect width="21" height="2" y="12"/>
          </g>
        </svg>
      </div>

      <div v-if="show_menu" class="mobile-links">
        <router-link :to="{name: 'aquatic-invasives'}">
          <span v-on:click="show_menu = false">Aquatic Invasives</span>
        </router-link>

        <router-link :to="{name: 'about'}">
          <span v-on:click="show_menu = false">About</span>
        </router-link>

      </div>

      </div>

    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      show_menu: false
    }
  },
  methods: {
    hide () {
      this.show_menu = false
    }
  }
}
</script>

<style scoped lang='scss'>
#nav {
  position: relative;
  z-index: 99999;
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
      display: none;
    }
  }

  .nav-links--mobile {
    display: none;
    @include respond-to(handheld) {
      display: inherit;
      position: absolute;
      z-index: 99999;
      right: 15px;
      top: 8px;
      width: 50%;
      text-align: right;
    }

    a:link, a:visited {
      text-decoration: none;
      color: $primary_color;
    }
  }

  .menu-trigger {
    position: absolute;
    top: 0px;
    right: 0px;
    height: 25px;
    width: 25px;
    cursor: pointer;
  }

  .mobile-links {
    position: absolute;
    text-align: right;
    top: 34px;
    right: 15px;
    width: 100%;
    height: auto;

    a span {
      display: block;
      width: 100%;
      padding: 8px 15px;
      background-color: white;
      &:hover {
        background-color: #dedede;
      }
    }
  }
}

a.router-link-active {
  border-bottom: 5px $primary_color solid;
  @include respond-to(handheld) {
    border-bottom: 0px solid black;
  }
}

.site-title a:link, .site-title a:visited {
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
