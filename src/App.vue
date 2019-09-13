<style lang="scss">
  @import './styles/application';
</style>

<template>
  <div id="app">
    <nav-bar></nav-bar>
    <error-bar v-if='error != null' :error="error"/>
    <offline-card/>
    <router-view/>
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
  methods: {
    ...mapActions(['markTimestamp', 'fetchLakes']),
    ...mapGetters(['getTimeElapsed', 'getLakes']),
  },
  computed: {
    error () {
      return this.$store.state.error;
    }
  },
  created () {
    if (!this.getLakes().length) {
      this.markTimestamp('waterbody-major');
      return this.fetchLakes('major').then(() => {
        let gte = this.getTimeElapsed();
        console.debug("Loading major waterbody index took " + gte('waterbody-major') + "ms");

        this.markTimestamp('waterbody-minor');
        this.fetchLakes('minor').then(() => {
          let gte = this.getTimeElapsed();
          console.debug("Loading minor waterbody index took " + gte('waterbody-minor') + "ms");
        });
      });
    } else {
      return new Promise ((resolve) => {
        console.info('The lake index is already loaded.');
        resolve();
      });
    }
  }
}
</script>
