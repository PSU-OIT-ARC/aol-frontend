<template>
  <div v-if='lake' class="lake-detail detail">

    <div class="lake-detail-photo-wrapper detail-photo-wrapper">
      <div class="lake-detail-photo detail-photo"
           v-bind:class="[!lake.photo ? 'photo--generic' : '']"
           :style="photo_style">
      </div>
    </div>

    <div class="lake-detail-content-wrapper detail-content-wrapper">
      <div class="gutter gutter--left"></div>
      <div class="lake-detail-content detail-content">
        <div class="lake-detail-header detail-header">
          <div class="lake-detail__nav detail__nav">
            <router-link class="back-to-sidebar"
                         :to="sidebar_href">
              &larr; Back
            </router-link>
            <router-link class="close-sidebar" :to="back_href">
              <close-button-svg />
            </router-link>
          </div> <!-- end lake-detail__nav -->
          <lake-card :lake="lake"></lake-card>
        </div> <!-- end lake-detail-header -->

        <div class="lake-detail-body detail-body">
          <div class="lake-detail-main detail-main">
            <data-tabs :lake='lake'></data-tabs>
          </div>

          <div class="lake-detail-sidebar detail-sidebar" v-if="!mobile_mode()">
            <watershed></watershed>
            <documents v-if="lake.documents.length" :lake="lake"></documents>
          </div>
        </div> <!-- end lake-detail-body -->

        <aol-footer />

      </div>



      <div class="gutter gutter--right"></div>


    </div> <!-- end lake-detail-content-wrapper -->



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
      return {name: 'map', query: {lake: this.reachcode}};
    },
    back_href () {
      return {name: 'map'};
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
  }

  .lake-detail-photo-wrapper {
  }

  .lake-detail-photo {
  }

  .lake-detail-content-wrapper {
  }

  .lake-detail-content {
  }

  .lake-detail-header {
  }

  .lake-detail__nav {
  }

  .lake-detail-body {
  }

  .lake-detail-main {
    @include respond-to(handheld) {
      padding-right: 0px;
      margin-left: 0px;
    }
  }

  .lake-detail-sidebar {
    @include respond-to(handheld) {
      display: none;
      padding-left: 0px;
      margin-right: 0px;
    }
  }

</style>
