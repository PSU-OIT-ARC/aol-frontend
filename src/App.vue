<style lang="scss">
  @import './styles/application';
</style>

<template>
  <div id="app">
    <nav-bar v-bind:class="[!isOnline() ? 'offline' : '']"/>
    <offline-bar v-show="!isOnline()"/>
    <error-bar v-if='error != null' :error="error"/>
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import OfflineBar from '@/components/OfflineBar';
import NavBar from '@/components/NavBar';
import ErrorBar from '@/components/ErrorBar';

export default {
  name: 'app',
  components: { NavBar, OfflineBar, ErrorBar },
  computed: {
    error () {
      return this.$store.state.error;
    }
  },
  methods: {
    ...mapActions(['fetchPage']),
    isOnline () {
      return navigator.onLine;
    }
  },
  created () {
    // pre-fetch major flatpages
    ['bathymetry',
     'aquatic-invasives',
     'about',
     'photo-submissions'].forEach((slug) => {
        this.fetchPage(slug);
    });
  },
  metaInfo: {
    titleTemplate: '%s | Atlas of Oregon Lakes',
    htmlAttrs: {
      lang: 'en-US'
    },
    meta: [
      { charset: 'utf-8' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1.0' },
      { name: 'description', content: "The Atlas of Oregon Lakes is a resource for the public, resource management agencies, and scientists to enhance management and enjoyment of our lakes. The online atlas is an updated version of the popular Atlas of Oregon Lakes published in 1985." }
    ]
  }
}
</script>

<style lang="scss" scoped>
  #app {
    overflow: hidden;
  }
</style>
