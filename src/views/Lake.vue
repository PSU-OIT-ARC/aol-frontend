<template>
  <offline-card v-if="!isOnline() && lake == null" />
  <div v-else-if="lake != null"
       class="lake-detail detail">

    <div class="lake-detail-photo-wrapper detail-photo-wrapper">
      <div class="lake-detail-photo detail-photo"
           v-bind:class="[!lake.photo ? 'photo--generic' : '']"
           v-bind:style="photo_style">
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

          <div class="lake-detail-sidebar detail-sidebar" v-if="!isMobileMode()">
            <watershed></watershed>
            <documents v-if="lake.documents.length" :lake="lake"></documents>
            <resources v-if="lake.resources.length" :lake="lake"></resources>
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

import OfflineCard from '@/components/OfflineCard';
import CloseButtonSVG from '@/components/CloseButtonSVG';
import LakeCard from '@/components/lake/LakeCard';
import DataTabs from '@/components/lake/DataTabs';
import {Watershed, Documents, Resources} from '@/components/lake/metadata';
import AolFooter from '@/components/AolFooter';

import config from '@/config';

export default {
  name: 'lake',
  props: {
    reachcode: String,
  },
  data () {
    return {
      lake: null
    }
  },
  components: {
    OfflineCard,
    'close-button-svg': CloseButtonSVG,
    LakeCard,
    DataTabs,
    Documents,
    Resources,
    Watershed,
    AolFooter
  },
  computed: {
    ...mapGetters({currentLake: 'getCurrentLake',
                   currentLakeTitle: 'getCurrentLakeTitle'}),
    sidebar_href () {
      return {name: 'map', query: {lake: this.reachcode}};
    },
    back_href () {
      return {name: 'map'};
    },
    photo_style () {
      let photo = require('@/assets/generic_background.png');
      if (this.lake != null && this.lake.photo) {
        photo = this.lake.photo;
      }
      return {'backgroundImage': 'url(' + photo + ')'}
    },
  },
  methods: {
    ...mapActions(['fetchLake', 'resetSearchResults']),
    isMobileMode () {
      return config.is_mobile(window);
    },
    isOnline () {
      return navigator.onLine;
    }
  },
  created () {
    // clear out any search SearchResults
    this.resetSearchResults();

    // fetch the non-indexed lake object
    this.fetchLake({reachcode: parseInt(this.reachcode)})
  },
  destroyed () {
    // unload the current lake object
    this.fetchLake({reachcode: null});
  },
  watch: {
    '$route': function () {
      this.fetchLake({reachcode: parseInt(this.reachcode)})
    },
    'currentLake': function () {
      this.lake = this.currentLake;
    }
  },
  metaInfo () {
    return {
      title: this.currentLakeTitle
    }
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
