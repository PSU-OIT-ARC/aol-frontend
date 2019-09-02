<template>
  <div class="lake-sidebar" v-if="lake">

    <div class="sidebar-photo-wrapper">
      <div class="sidebar-photo" :style="photo_style"></div>
    </div>

    <div class="sidebar-content">

      <div class="sidebar__nav">
        <router-link :to="search_href" @click.native="close">
          <div v-if="has_results">
            <p>&larr; Back to Search</p>
          </div>
          <div v-else>
            <p>&larr; Back to Map</p>
          </div>
        </router-link>
        <div class="close-sidebar" @click="close">
          <svg xmlns="http://www.w3.org/2000/svg" width="982" height="982" viewBox="0 0 982 982">
            <path fill-rule="evenodd" d="M576.8,491 L962.7,105.1 C987.2,80.6 987.2,43.8 962.7,19.3 C938.2,-5.2 901.4,-5.2 876.9,19.3 L491,405.3 L105.1,19.4 C80.6,-5.1 43.9,-5.1 19.3,19.4 C-5.2,43.9 -5.2,80.7 19.3,105.2 L402.2,491 L19.4,876.9 C-5.1,901.4 -5.1,938.2 19.4,962.7 C28.6,975 47,981.1 62.3,981.1 C77.6,981.1 92.9,975 105.2,962.7 L491,576.8 L876.9,962.7 C889.2,975 904.5,981.1 919.8,981.1 C935.1,981.1 950.4,975 962.7,962.7 C987.2,938.2 987.2,901.4 962.7,876.9 L576.8,491 Z"/>
          </svg>
        </div>
      </div>

      <div v-if="lake.is_major">
        <router-link :to="lake_href(lake)">
          <lake-card :lake='lake'></lake-card>
        </router-link>

        <div class="lake-summary">
          <data-tabs :lake='lake' :tabs_only='true'></data-tabs>

          <p v-for="(line, index) in lake.body"
             v-bind:index="index"
             v-bind:key="index">
           {{ line }}<br />
          </p>
        </div>
      </div>
      <div v-else>
        <minor-lake-card :lake='lake'></minor-lake-card>
        <div class="lake-summary">
          <p>
            {{lake.title}} is a {{lake.waterbody_type}}.
          </p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import LakeCard from '@/components/lake/LakeCard';
import MinorLakeCard from '@/components/lake/MinorLakeCard';
import DataTabs from '@/components/lake/DataTabs';
import TextSection from '@/components/lake/metadata/TextSection';

export default {
  name: 'lake-sidebar',
  props: ['lake'],
  components: {
    LakeCard,
    MinorLakeCard,
    DataTabs
    TextSection
  },
  methods: {
    ...mapActions(['setCurrentFocus']),
    lake_href (lake) {
      return {name: 'lake', params: {'reachcode': lake.reachcode}};
    },
    close () {
      this.setCurrentFocus();
      this.$router.push({name: 'home'});
    }
  },
  computed: {
    ...mapGetters(['searchResults']),
    has_results () {
      return this.searchResults != null && this.searchResults.length;
    },
    search_href () {
      return {name: 'home'}
    },
    photo_style () {
      let photo = require('@/assets/intro-umpqua-lake.png');
      if (this.lake.photo) {
        photo = this.lake.photo;
      } else if (this.lake.photos && this.lake.photos.length) {
        photo = this.lake.photos[0].href;
      }
      return {'backgroundImage': 'url(' + photo + ')'}
    }
  },
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
    padding: 0px 15px;
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

  .sidebar-content {
    position: relative;
    top: -130px;
    height: 82.2vh;  // fixes an issue
    @include respond-to(handheld) {
      height: 70vh;  // keep sidebar text scrollable on mobile
    }
  }

  .close-sidebar {
    cursor: pointer;
    text-align: right;
    margin-top: 8px;

    svg {
      fill: #fff;
      width: 15px;
      height: 15px;
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
