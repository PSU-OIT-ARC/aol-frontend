<template>
<div class='outer-wrap'>
  <aol-map class='behind'></aol-map>
  <div v-if='lake' class="lake-detail-wrapper">

    <div class="blur-image-wrapper">
      <div class="blur-image" :style="{'background-image': 'url(' + require('@/assets/intro-umpqua-lake.png') + ')'}">
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
            <div id='map'></div>
            <div class="close-sidebar" @click="close">╳</div>

            <lake-card class="card" :lake="lake"></lake-card>

          </div>

          <div class="content-body">

            <div class="body-main">
              <data-tabs :lake='lake' :with_sections='true'></data-tabs>
            </div>

            <div class="body-sidebar">

              <watershed></watershed>
              <documents></documents>

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
import AolMap from '@/components/map/AolMap';

export default {
  name: 'lake',
  props: {
    slug: String,
  },
  components: {
    LakeCard,
    DataTabs,
    Documents,
    Watershed,
    AolMap
  },
  computed: {
    ...mapGetters(['getCurrentLake']),
    lake () {
      return this.getCurrentLake;
    },
    back () {
      if (this.lake) {
        return {lake: this.lake.slug };
      }
      return {};
    }
  },
  methods: {
    ...mapActions(['fetchLake', 'fetchLakes', 'searchLakes']),
    close () {
      this.$router.push({name: 'home'});
    }
  },
  created () {
    // clear out any search SearchResults
    this.searchLakes(null);

    if (this.getCurrentLake == null) {
      // get this lake first, then fetch the other lakes.
      this.fetchLake(this.slug).then(()=>{
        this.fetchLakes();
      })
    }
    else {
      console.log("I already have a lake, don't make me fetch it again")
    }
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
    filter: blur(9px);
    transform: scale(1.1);
  }

  .close-sidebar {
    position: absolute;
    top: 5px;
    right: 0;
    cursor: pointer;
    font-size: 1em;
    color: white;
    text-align: right;
    @include respond-to(handheld) {
      padding: 0px 15px;
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
