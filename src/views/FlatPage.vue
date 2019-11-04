<template>
  <offline-card v-if="!isOnline() && page == null"/>
  <div v-else-if="page != null"
       class="page-detail detail">

    <div class="page-detail-photo-wrapper detail-photo-wrapper">
      <div class="page-detail-photo detail-photo" :style="photo_style"></div>
    </div>

    <div class="page-detail-content-wrapper detail-content-wrapper">
      <div class="gutter gutter--left"></div>
      <div class="page-detail-content detail-content">
        <div class="page-detail-header detail-header">
          <div class="page-detail__nav detail__nav">
          </div>
          <div class="lake-card">
            <div class="photo" :style="photo_style"></div>
            <div class="info">
              <h4>A Public Resource Since 1985</h4>
              <h2>{{ page.title }}</h2>
            </div>
          </div>
        </div>

        <div class="page-detail-body detail-body">
          <div class="page-detail-main detail-main"
               v-html="cleanedHTML()"></div>
          <div class="page-detail-sidebar detail-sidebar">
            <contact-info />
          </div>
        </div>

        <aol-footer />

      </div>

    </div>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import OfflineCard from '@/components/OfflineCard';
import ContactInfo from '@/components/ContactInfo';
import AolFooter from '@/components/AolFooter';

export default {
  name: 'page',
  props: {
    slug: String,
  },
  data () {
    return {
      page: null
    }
  },
  components: {
    OfflineCard,
    ContactInfo,
    AolFooter
  },
  computed: {
    ...mapGetters({currentPage: 'getCurrentPage',
                   currentPageTitle: 'getCurrentPageTitle'}),
    photo_style () {
      let photo = require('@/assets/intro-umpqua-lake.png');
      return {'backgroundImage': 'url(' + photo + ')'}
    }
  },
  methods: {
    ...mapActions(['fetchPage']),
    cleanedHTML () {
      if (this.page.content !== undefined || this.page.content != null) {
        return this.page.content.replace('<p>&nbsp;</p>', '');
      } else {
        return this.page.content;
      }
    },
    isOnline () {
      return navigator.onLine;
    }
  },
  created () {
    // load the requested page object
    this.fetchPage({slug: this.slug})
  },
  destroyed () {
    // unload the current page object
    this.fetchPage({slug: null});
  },
  watch: {
    '$route': function () {
      this.fetchPage({slug: this.slug});
    },
    'currentPage': function () {
      this.page = this.currentPage;
    }
  },
  metaInfo () {
    return {
      title: this.currentPageTitle
    }
  }
}
</script>

<style scoped lang='scss'>
  .page-detail {
  }

  .page-detail-photo-wrapper {
  }

  .page-detail-photo {
  }

  .page-detail-content-wrapper {
    background: white;
  }

  .page-detail-content {
  }

  .page-detail-header {
  }

  .page-detail__nav {
  }

  .page-detail-body {
  }

  .page-detail-main {
  }

  .page-detail-sidebar {
  }

  .contact-info {
    padding: 15px;
    background-color: whitesmoke;

    @include respond-to(handheld) {
      margin-top: 1em;
    }
  }

  footer {
    background-color: whitesmoke;

    @include respond-to(handheld) {
      background-color: white;
    }
 }

  h2 {
    font-family: "Lato-Bold", sans-serif;
    font-size: 2em;
    margin-top: 5px;
    @include respond-to(handheld) {
      font-size: 1.1em;
      line-height: 1.3em;
      margin: 0;
    }
  }

  h4 {
    font-family: "Lato-Bold", sans-serif;
    font-size: 1em;
    color: #777;
    text-transform: uppercase;
    display: block;
    margin: 0;
    @include respond-to(handheld) {
      font-size: .8em;
      margin-bottom: 10px;
    }
  }

</style>
