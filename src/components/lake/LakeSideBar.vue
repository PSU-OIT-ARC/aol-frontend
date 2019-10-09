<template>
  <div class="lake-sidebar sidebar">

    <div class="lake-sidebar-photo-wrapper sidebar-photo-wrapper">
      <div class="lake-sidebar-photo sidebar-photo"
           v-bind:class="[!lake.photo ? 'photo--generic' : '']"
           :style="photo_style">
      </div>
    </div>

    <div class="lake-sidebar-content-wrapper sidebar-content-wrapper">
      <div class="gutter gutter--left"></div>
      <div class="lake-sidebar-content sidebar-content">
        <div class="lake-sidebar-header sidebar-header">
          <div class="lake-sidebar__nav sidebar__nav">
            <div>
              <router-link v-if="has_results"
                           class="back-to-sidebar"
                           :to="back_href">
                &larr; Back to Search
              </router-link>
            </div>
            <div>
              <span @click="close">
                <router-link class="close-sidebar"
                            :to="back_href">
                  <close-button-svg />
                </router-link>
              </span>
            </div>
          </div> <!-- end lake-sidebar__nav -->
          <router-link v-if="lake.is_major" :to="lake_href">
            <lake-card :lake='lake'></lake-card>
          </router-link>
          <lake-card v-if="!lake.is_major" :lake='lake'></lake-card>
        </div> <!-- end lake-sidebar-header -->

        <div class="lake-sidebar-body sidebar-body">
          <data-tabs :lake='lake' :tabs_only='true'></data-tabs>
          <text-section class="text-summary" :lake='lake'></text-section>
        </div> <!-- end lake-sidebar-body -->

      </div>

      <div class="gutter gutter--right"></div>

    </div> <!-- end lake-sidebar-content-wrapper -->

  </div> <!-- end lake-sidebar -->
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

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
    ...mapGetters({searchResults: 'getSearchResults'}),
    has_results () {
      return this.searchResults != null && this.searchResults.length;
    },
    back_href () {
      return {name: 'home'};
    },
    lake_href () {
      return {name: 'lake', params: {reachcode: this.lake.reachcode}, hash: "#text-section"};
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
    ...mapActions(['resetSearchResults']),
    close () {
      this.resetSearchResults();
    }
  }
}
</script>

<style scoped lang='scss'>
  .lake-sidebar {
  }

  .lake-sidebar-content-wrapper {
  }

  .lake-sidebar-content {
  }

  .lake-sidebar-header {
    a {
      display: block;
      text-decoration: none;
    }
    a:hover, a:focus {
      background-color: transparent;
    }
  }

  .lake-sidebar-body {
  }

  .text-summary {
    font-size: .85em;
    line-height: 20px;

    background-color: white;
    padding: 10px 15px 10px 15px;
  }
</style>
