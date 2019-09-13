<template>
<div class='outer-wrap'>
  <div v-if='lake' class="lake-detail-wrapper">

    <div class="blur-image-wrapper">
      <div class="blur-image" :style="photo_style"></div>
    </div>

    <div class="lake-detail">

      <div class="gutter gutter--left">
      </div>

        <div class="content-wrapper">

          <div class="content-header">
            <div class="content__nav">
              <div class='back-to-sidebar'>
                <router-link :to="sidebar_href">
                  &larr; Back
                </router-link>
              </div>
              <div class="close-sidebar">
                <router-link :to="back_href">
                  <close-button-svg />
                </router-link>
              </div>
            </div>

           <lake-card class="card" :lake="lake"></lake-card>
          </div> <!-- end content-nav -->

          <div class="content-body">
            <div class="body-main">
              <data-tabs :lake='lake'></data-tabs>
            </div>

            <div class="body-sidebar" v-if="!mobile_mode">
              <watershed></watershed>
              <documents v-if="lake.documents.length" :lake="lake"></documents>
            </div>
          </div> <!-- end content-body -->

        </div> <!-- end content-header -->

        <div class="gutter gutter--right"></div>

    </div> <!-- end content-wrapper -->
  </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import CloseButtonSVG from '@/components/CloseButtonSVG';
import LakeCard from '@/components/lake/LakeCard';
import DataTabs from '@/components/lake/DataTabs';
import {Watershed, Documents} from '@/components/lake/metadata';

import config from '@/config';

export default {
  name: 'lake',
  props: {
    reachcode: String,
  },
  components: {
    'close-button-svg': CloseButtonSVG,
    LakeCard,
    DataTabs,
    Documents,
    Watershed,
  },
  computed: {
    ...mapGetters(['getCurrentLake']),
    lake () {
      return this.getCurrentLake;
    },
    sidebar_href () {
      return {name: 'home', query: {lake: this.lake.reachcode}};
    },
    back_href () {
      return {name: 'home', query: {}};
    },
    mobile_mode () {
      return config.is_mobile(window);
    },
    photo_style () {
      let photo = require('@/assets/generic_background.png');
      if (this.lake.photo) {
        photo = this.lake.photo;
      }
      return {'backgroundImage': 'url(' + photo + ')'}
    }
  },
  methods: {
    ...mapActions(['fetchLake', 'resetSearchResults']),
  },
  created () {
    // clear out any search SearchResults
    this.resetSearchResults();

    // fetch the non-indexed lake object
    this.fetchLake(parseInt(this.reachcode))
  }
}
</script>

<style scoped lang='scss'>
  .lake-detail-wrapper {
    display: grid;
    grid-template-rows: 200px 1fr;
    grid-template-columns: 1fr;
    height: 100vh;

    @include respond-to(handheld) {
      grid-template-rows: 150px 1fr;
    }
  }

  .lake-detail {
    display: grid;
    grid-template-columns: 1fr minmax(900px, 1200px) 1fr;
    background: whitesmoke;
    @include respond-to(handheld) {
      width: 100vw;
    }
  }

  .blur-image-wrapper {
    background-color: #838383;
    overflow: hidden;
    position: relative;
  }

  .blur-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 200px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    filter: blur(9px) brightness(80%);
    transform: scale(1.1);
  }

  .back-to-sidebar {
    text-align: left;
  }

  .content-wrapper {
    position: relative;
    top: -180px;
    @include respond-to(handheld) {
      top: -140px;
    }
    @include respond-to(handheld) {
      width: 100vw;
    }
  }

  .content-header {
    @include respond-to(handheld) {
      padding: 0px 15px;
    }
  }

  .content__nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 10px 0px;
    position: relative;
    top: 0px;

    a {
      color:white;
    }
  }

  .content-body {
    display: grid;
    grid-template-columns: 2.1fr .9fr;
    margin-top: 40px;
    @include respond-to(handheld) {
      margin-top: 20px;
      grid-template-columns: none;
      grid-template-rows: auto auto;
    }
  }

  .body-sidebar {
    padding: 0px 0px 0px 50px;
    @include respond-to(handheld) {
      display: none;
      padding: 0px 15px;
    }

  }


  .behind {
    width: 100vw;
    height: 100vh;
    position: absolute;
    z-index: -1;
  }

</style>
