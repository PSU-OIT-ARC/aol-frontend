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
import OfflineCard from '@/components/OfflineCard';
import NavBar from '@/components/NavBar';
import ErrorBar from '@/components/ErrorBar';

export default {
  name: 'app',
  components: { NavBar, OfflineBar, OfflineCard, ErrorBar },
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
  }
}
</script>

<style lang="scss" scoped>
  #app {
    overflow: hidden;
  }
</style>
