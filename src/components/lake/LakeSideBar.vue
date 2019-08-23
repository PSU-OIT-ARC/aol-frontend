<template>
  <div class="lake-sidebar" v-if="lake">

    <div class="sidebar-photo-wrapper">
      <div class="sidebar-photo" :style="photo_style"></div>
    </div>

    <div class="sidebar-content">

      <div class="sidebar__nav">
        <router-link :to="search_href" @click.native="close">
          <p>&larr; Back to Search</p>
        </router-link>
        <div class="close-sidebar" @click="close">╳</div>
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
      </div>
      <div class="lake-summary">
        <p>Minor lake text here.</p>
      </div>
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex';

import LakeCard from '@/components/lake/LakeCard';
import MinorLakeCard from '@/components/lake/MinorLakeCard';
import DataTabs from '@/components/lake/DataTabs';

export default {
  name: 'lake-sidebar',
  props: ['lake'],
  components: {
    LakeCard,
    MinorLakeCard,
    DataTabs
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
    search_href () {
      return {name: 'home'}
    },
    photo_style () {
      let photo = require('@/assets/intro-umpqua-lake.png');
      return {'background-image': 'url(' + photo + ')'}
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
    filter: blur(9px);
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
    font-size: 1em;
    color: white;
    text-align: right;
    margin-top: 8px;
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
    padding: 65px 15px 50px 15px;
    height: calc(100vh - 365px);

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
