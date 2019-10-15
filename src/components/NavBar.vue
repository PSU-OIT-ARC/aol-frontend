<template>
  <div id="nav">

    <div class="site-title">
      <h1>
        <router-link :to="{name: 'map'}">
          Atlas <span>of Oregon Lakes</span>
        </router-link>
      </h1>
    </div>

    <div class="nav-links">
      <router-link :to="{name: 'flatpage', params: {slug: 'bathymetry'}}">
        Bathymetry
      </router-link>
      <router-link :to="{name: 'flatpage', params: {slug: 'aquatic-invasives'}}">
        Aquatic Invasives
      </router-link>
      <router-link :to="{name: 'flatpage', params: {slug: 'about'}}">
        About
      </router-link>
    </div>

    <div class="nav-links--mobile">

      <div role="button" aria-label="menu" v-bind:class="['menu-trigger', { expand: show_menu}]" @click="show_menu = !show_menu">
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="14" viewBox="0 0 21 14">
          <g>
            <rect width="21" height="2"/>
            <rect width="21" height="2" y="6"/>
            <rect width="21" height="2" y="12"/>
          </g>
        </svg>
      </div>

      <div v-if="show_menu" class="mobile-links">
        <router-link :to="{name: 'flatpage', params: {slug: 'bathymetry'}}">
          <span v-on:click="show_menu = false">Bathymetry</span>
        </router-link>

        <router-link :to="{name: 'flatpage', params: {slug: 'aquatic-invasives'}}">
          <span v-on:click="show_menu = false">Aquatic Invasives</span>
        </router-link>

        <router-link :to="{name: 'flatpage', params: {slug: 'about'}}">
          <span v-on:click="show_menu = false">About</span>
        </router-link>
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
  z-index: 5000;
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

    a:link, a:visited {
      margin-left: 25px;
      color: $primary_color;
      text-decoration: none;
      padding-bottom: 7px;

      &:hover {
        color: #222;
      }
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
      display: block;
      position: absolute;
      z-index: 5000;
      right: 0px;
      top: 0px;
      width: 50%;
      text-align: right;
    }

    a:link, a:visited {
      text-decoration: none;
      color: white;
    }
  }

  .menu-trigger {
    position: absolute;
    top: 0px;
    right: 0px;
    height: 27px;
    width: 25px;
    cursor: pointer;
    padding: 10px 15px;

    svg g {
      fill: $primary_color;
    }
  }

  .menu-trigger.expand {
    background-color: $primary_color;
    svg g {
      fill: white;
    }
  }

  .mobile-links {
    position: absolute;
    text-align: right;
    top: 43px;
    right: 0px;
    width: 100%;
    height: auto;
    background-color: white;
    animation: slide-in 100ms forwards;
    background-color: $primary_color;
    padding-bottom: 10px;


    a span {
      display: block;
      position: relative;
      left: 0px;
      padding: 10px 15px 0px 0px;
      background-color: $primary_color;

      &:hover {
        background-color: lighten($primary_color, 10%);
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
