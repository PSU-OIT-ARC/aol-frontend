<template>
<div class='outer-wrap'>
  <div v-if='lake' class="lake-detail-wrapper">

    <div class="blur-image-wrapper">
      <div class="blur-image" :style="photo_style">
        <!-- These inline images should either be the first photo of what is available for the lake, or default to this intro-upmpqua-lake.png -->
      </div>
    </div>

    <div class="lake-detail">

      <div class="gutter gutter--left">
      </div>

        <div class="content-wrapper">

          <div class="content-header">
            <div class='back'>
              <router-link :to="{ name: 'home', query: back }">
                &larr; Back to Map
              </router-link>
            </div>
            <div class="close-sidebar" @click="close">
              <svg xmlns="http://www.w3.org/2000/svg" width="982" height="982" viewBox="0 0 982 982">
                <path fill-rule="evenodd" d="M576.8,491 L962.7,105.1 C987.2,80.6 987.2,43.8 962.7,19.3 C938.2,-5.2 901.4,-5.2 876.9,19.3 L491,405.3 L105.1,19.4 C80.6,-5.1 43.9,-5.1 19.3,19.4 C-5.2,43.9 -5.2,80.7 19.3,105.2 L402.2,491 L19.4,876.9 C-5.1,901.4 -5.1,938.2 19.4,962.7 C28.6,975 47,981.1 62.3,981.1 C77.6,981.1 92.9,975 105.2,962.7 L491,576.8 L876.9,962.7 C889.2,975 904.5,981.1 919.8,981.1 C935.1,981.1 950.4,975 962.7,962.7 C987.2,938.2 987.2,901.4 962.7,876.9 L576.8,491 Z"/>
              </svg>
           </div>

            <lake-card class="card" :lake="lake"></lake-card>

          </div>

          <div class="content-body">

            <div class="body-main">
              <data-tabs :lake='lake' :with_sections='true'></data-tabs>
            </div>

            <div class="body-sidebar">

              <watershed v-if="!mobile_mode" :lake="lake"></watershed>
              <documents v-if="docs" :lake="lake"></documents>

            </div>

          </div> <!-- end content-body -->


        </div>

        <div class="gutter gutter--right"></div>

    </div> <!-- end content-wrapper -->
  </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import LakeCard from '@/components/lake/LakeCard';
import DataTabs from '@/components/lake/DataTabs';
import Watershed from '@/components/lake/Watershed';
import Documents from '@/components/lake/Documents';

export default {
  name: 'lake',
  props: {
    reachcode: String,
  },
  components: {
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
    back () {
      let query = {}
      if (this.lake) {
        query["lake"] = this.lake.reachcode;
      }
      return query
    },
    mobile_mode () {
      return window.innerWidth < 600;
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
  methods: {
    ...mapActions(['fetchLake', 'searchLakes']),
    close () {
      this.$router.push({name: 'home'});
    }
  },
  created () {
    // clear out any search SearchResults
    this.searchLakes(null);

    //
    this.fetchLake(this.reachcode);
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

  .close-sidebar {
    position: absolute;
    top: 5px;
    right: 0;
    cursor: pointer;
    text-align: right;
    @include respond-to(handheld) {
      padding: 0px 15px;
    }

    svg {
      fill: #fff;
      width: 15px;
      height: 15px;
    }
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
    .back {
      margin: 10px 0;
    }
    .back a {
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
