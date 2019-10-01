<template>
  <div v-if='lake' class="lake-detail">
    <div class="detail-photo-wrapper">
      <div class="detail-photo" :style="photo_style"></div>
    </div>



    <div class="detail-content-wrapper">
      <div class="gutter gutter--left"></div>
      <div class="detail-content">
        <div class="detail-header">
          <div class="detail__nav">
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
          </div> <!-- end detail__nav -->

          <lake-card :lake="lake"></lake-card>
        </div>
        <div class="detail-body">
          <div class="detail-main">
            <data-tabs :lake='lake'></data-tabs>
          </div>

          <div class="detail-sidebar" v-if="!mobile_mode()">
            <watershed></watershed>
            <documents v-if="lake.documents.length" :lake="lake"></documents>
          </div>



        </div> <!-- end detail-body -->

        <aol-footer />

      </div>



      <div class="gutter gutter--right"></div>


    </div> <!-- end detail-content-wrapper -->



  </div> <!-- end lake-detail -->
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import CloseButtonSVG from '@/components/CloseButtonSVG';
import LakeCard from '@/components/lake/LakeCard';
import DataTabs from '@/components/lake/DataTabs';
import {Watershed, Documents} from '@/components/lake/metadata';
import AolFooter from '@/components/AolFooter';


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
    AolFooter
  },
  computed: {
    ...mapGetters({lake: 'getCurrentLake'}),
    sidebar_href () {
      return {name: 'home', query: {lake: this.reachcode}};
    },
    back_href () {
      return {name: 'home', query: {f: this.reachcode}};
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
    ...mapActions(['fetchLake']),
    mobile_mode () {
      return config.is_mobile(window);
    },
  },
  created () {
    // clear out any search SearchResults
    this.resetSearchResults();

    // fetch the non-indexed lake object
    this.fetchLake(parseInt(this.reachcode))
  },
  destroyed () {
    // unload the current lake object
    this.fetchLake(null);
  }
}
</script>

<style scoped lang='scss'>
  .lake-detail {
    display: grid;
    grid-template-rows: 200px 1fr;
    grid-template-columns: 1fr;
    height: 100vh;

    @include respond-to(handheld) {
      grid-template-rows: 150px 1fr;
    }
  }

  .detail-photo-wrapper {
    background-color: #838383;
    overflow: hidden;
    position: relative;

    @include respond-to(handheld) {
      width: 100vw;
    }
    @include respond-to(medscreen) {
      width: 100vw;
    }
    @include respond-to(lgscreen) {
      width: 100vw;
    }
  }

  .detail-photo {
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

  .detail-content-wrapper {

    display: grid;
    grid-template-columns: 1fr minmax(900px, 1200px) 1fr;
    background: whitesmoke;

    @include respond-to(handheld) {
      width: 100vw;
    }
    @include respond-to(medscreen) {
      width: 100vw;
    }
    @include respond-to(lgscreen) {
      width: 100vw;
    }
  }

  .detail-content {
    position: relative;
    top: -180px;

    @include respond-to(handheld) {
      top: -140px;
      width: 100vw;
    }
    @include respond-to(medscreen) {
      width: 100vw;
    }
    @include respond-to(lgscreen) {
      width: 100vw;
    }
  }

  .detail-header {
  }

  .detail__nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 15px 0px;
    position: relative;
    top: -10px;

    a {
      color:white;
    }

    @include respond-to(handheld) {
      padding: 15px;
    }
    @include respond-to(medscreen) {
      padding: 15px;
    }
    @include respond-to(lgscreen) {
      padding: 15px;
    }
  }

  .back-to-sidebar {
    text-align: left;
  }

  .detail-body {
    display: grid;
    grid-template-columns: 2.1fr .9fr;
    margin-top: 40px;

    @include respond-to(handheld) {
      margin-top: 20px;
      grid-template-columns: none;
      grid-template-rows: auto auto;
    }

  }

  .detail-main {
    padding: 0px 0px 0px 0px;

    @include respond-to(handheld) {
      padding-right: 0px;
      margin-left: 0px;
    }
    @include respond-to(medscreen) {
      padding-right: 10px;
      margin-left: 15px;
    }
    @include respond-to(lgscreen) {
      padding-right: 10px;
      margin-left: 15px;
    }

  }
  .detail-sidebar {
    padding: 0px 0px 0px 50px;

    @include respond-to(handheld) {
      display: none;
      padding-left: 0px;
      margin-right: 0px;
    }
    @include respond-to(medscreen) {
      padding-left: 10px;
      margin-right: 15px;
    }
    @include respond-to(lgscreen) {
      padding-left: 10px;
      margin-right: 15px;
    }
  }

  .behind {
    width: 100vw;
    height: 100vh;
    position: absolute;
    z-index: -1;
  }

</style>
