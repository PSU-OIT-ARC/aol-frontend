<style lang="scss">
  @import './styles/application';
</style>

<template>
  <div id="app">
    <nav-bar></nav-bar>
    <error-bar v-if='error != null' :error="error"/>
    <offline-card v-show="!online()"/>
    <router-view v-show="online()"/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import NavBar from '@/components/NavBar';
import OfflineCard from '@/components/OfflineCard';
import ErrorBar from '@/components/ErrorBar';

export default {
  name: 'app',
  components: { NavBar, OfflineCard, ErrorBar },
  computed: {
    error () {
      return this.$store.state.error;
    }
  },
  methods: {
    online () {
      return navigator.onLine;
    }
  }
}
</script>
