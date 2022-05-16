<style lang="scss">
  @import './styles/application';
</style>

<template>
  <div id="app">
    <metainfo>
      <template v-slot:title="{ content }">{{ content }} | Atlas of Oregon Lakes</template>
    </metainfo>
    <nav-bar v-bind:class="[!isOnline() ? 'offline' : '']"/>
    <offline-bar v-if="!isOnline()"/>
    <not-found v-else-if="resourceNotFound()"/>
    <error-bar v-else-if="hasError()" :error="error"/>
    <router-view />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import OfflineBar from '@/components/OfflineBar';
import NavBar from '@/components/NavBar';
import ErrorBar from '@/components/ErrorBar';
import NotFound from '@/components/NotFound';

export default {
  name: 'app',
  components: { NavBar, OfflineBar, ErrorBar, NotFound },
  computed: {
    ...mapGetters({notFound: 'getNotFound',
                   error: 'getError'}),
  },
  methods: {
    ...mapActions(['fetchPage']),
    isOnline () {
      return navigator.onLine;
    },
    resourceNotFound () {
      return this.notFound;
    },
    hasError () {
      return this.error != null;
    }
  },
  created () {
    // pre-fetch major flatpages
    ['bathymetry',
     'aquatic-invasives',
     'about',
     'photo-submissions'].forEach((slug) => {
        this.fetchPage({slug:slug, store:false});
    });
  },
  metaInfo () {
    return {
      htmlAttrs: {'lang': 'en-US'},
      charset: 'utf-8',
      description: "The Atlas of Oregon Lakes is a resource for the public, resource management agencies, and scientists to enhance management and enjoyment of our lakes. The online atlas is an updated version of the popular Atlas of Oregon Lakes published in 1985.",
      viewport: {tag: 'meta', content: 'width=device-width,initial-scale=1.0'}
    }
  }
}
</script>

<style lang="scss" scoped>
  #app {
    overflow: hidden;
  }
</style>
