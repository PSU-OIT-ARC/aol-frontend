<template>
  <div class="lake-sidebar">

    <div class="sidebar-photo-wrapper">
      <div v-bind:class="[!lake.photo ? 'photo--generic' : '', 'sidebar-photo']" :style="photo_style"></div>
    </div>

    <div class="sidebar-content">

      <div class="sidebar__nav">
        <div class="back-to-search">
          <router-link v-if="has_results" :to="back_href">
            &larr; Back to Search
          </router-link>
        </div>
        <div class="close-sidebar">
          <router-link :to="map_href">
            <close-button-svg />
          </router-link>
        </div>
      </div>

      <router-link v-if="lake.is_major" :to="lake_href">
        <lake-card :lake='lake'></lake-card>
      </router-link>
      <lake-card v-if="!lake.is_major" :lake='lake'></lake-card>
      <div class="lake-summary">
        <data-tabs :lake='lake' :tabs_only='true'></data-tabs>
        <text-section :lake='lake' :truncate='true'></text-section>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import CloseButtonSVG from '@/components/CloseButtonSVG';
import LakeCard from '@/components/lake/LakeCard';
import DataTabs from '@/components/lake/DataTabs';
import TextSection from '@/components/lake/metadata/TextSection';

export default {
  name: 'lake-sidebar',
  props: ['lake'],
  components: {
    'close-button-svg': CloseButtonSVG,
    LakeCard,
    DataTabs,
    TextSection
  },
  computed: {
    ...mapGetters(['searchResults']),
    has_results () {
      return this.searchResults != null && this.searchResults.length;
    },
    back_href () {
      return {name: 'home', query: {}};
    },
    map_href () {
      return {name: 'home', query: {f: this.lake.reachcode}};
    },
    lake_href () {
      return {name: 'lake', params: {reachcode: this.lake.reachcode}};
    },
    photo_style () {
      let photo = require('@/assets/generic_background.png');
      if (this.lake.photo) {
        photo = this.lake.photo;
      }
      return {'backgroundImage': 'url(' + photo + ')'}
    }
  }
}
</script>

<style scoped>

/* Styles in lakecard.scss */

a:link, a:visited {
  display: block;
  text-decoration: none;
  color: black;
}

a:hover, a:focus {
  background-color: transparent;
}

</style>

<style scoped lang='scss'>

  .lake-sidebar {
    display: grid;
    position: absolute;
    grid-template-rows: 160px 1fr;
    width: $sidebar_width;
    z-index: 9999;
    height: 96%; /* controls whether you get page scroll after sidebar scroll is complete. Needs higher or dynamic value when window.height is > */
    background-color: #fff;

    @include respond-to(handheld) {
      top: 200px;
      width: 100vw;
    }
  }

  .sidebar__nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 15px 15px;
    position: relative;
    top: -30px;

    a {
      color: white;
    }
  }

  .sidebar-photo-wrapper {
    background-color: #838383;
    overflow: hidden;
    position: relative;

    @include respond-to(handheld) {
      width: 100vw;
    }

  }

  .sidebar-photo {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 160px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    filter: blur(9px) brightness(80%);
    transform: scale(1.1);
  }

  .photo--generic {

  }

  .sidebar-content {
    position: relative;
    top: -130px;
    height: 82.2vh;  // fixes an issue
    @include respond-to(handheld) {
      height: 70vh;  // keep sidebar text scrollable on mobile
    }
  }

  p {
    font-size: .9em;
    line-height: 1.5em;
  }

  .lake-summary {
    display: grid;
    grid-template-rows: auto auto auto;
    align-content: start;
    overflow-y: scroll;
    padding: 35px 15px 50px 15px;
    height: calc(100vh - 335px);

    @include respond-to(handheld) {
      width: calc(100vw - 30px);
      height: auto;
      overflow-y: hidden;
    }
  }

  .lake-summary p:last-of-type {
      padding-bottom: 60px;
  }

  .summary-chart {
    margin-top: 30px;
  }

  table {
    width: 100%;
  }

</style>
