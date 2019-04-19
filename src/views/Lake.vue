<template>
<div class='outer-wrap'>
  <aol-map class='behind'></aol-map>
  <div v-if='lake' class="lake-detail-wrapper">

    <div class="detail-shaded-head"></div>


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
            <div class="map-image--wrapper">
              <img src="~@/assets/watershed_fpo.jpg" />
              <p class="caption">
                <a href="#">Lake</a>|<a href="#">Watershed</a>
              </p>
            </div>

            <h3>Documents</h3>
            <ul class="documents-wrapper">
              <li><a href="#">Basin Statistics (pdf)</a></li>
              <li><a href="#">Atlas of Oregon Lakes Original book page (pdf)</a></li>
            </ul>


            <div class="photos-wrapper">
              <h3>Photos</h3>

              <div class="photos">
                <img src="~@/assets/generic_thumb_square.png" class="lake-photo"/>
                <img src="~@/assets/generic_thumb_square.png" class="lake-photo"/>
                <img src="~@/assets/generic_thumb_square.png" class="lake-photo"/>
                <img src="~@/assets/generic_thumb_square.png" class="lake-photo"/>
                <img src="~@/assets/generic_thumb_square.png" class="lake-photo"/>
                <img src="~@/assets/generic_thumb_square.png" class="lake-photo"/>
              </div>

            </div>

          </div>

        </div> <!-- end lake-detail--body -->

      </div>

      <div class="gutter gutter--right"></div>

    </div> <!-- end lake-detail -->
  </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import LakeCard from '@/components/lake/LakeCard';
import DataTabs from '@/components/lake/DataTabs';
import AolMap from '@/components/map/AolMap';

export default {
  name: 'lake',
  props: {
    slug: String,
  },
  components: {
    LakeCard,
    DataTabs,
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

  .detail-shaded-head {
    background-color: #838383;
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
      padding: 0px 15px;
    }
  }

  h3 {
    font-family: "Lato-Bold", sans-serif;
    font-size: 1.1em;
    font-weight: 700;
  }

  .map-image--wrapper {
    img {
      width: 100%;
      height: auto;
    }
  }

  .caption {
    text-align: center;
    a {
      padding: 5px;
    }
  }

  ul.documents-wrapper {
    padding: 15px;
    background-color: white;
    box-shadow: 2px 2px 4px #aaa;

    li {
      list-style-type: circle;
      margin: 0px 0px 8px 15px;
    }
  }

  .photos-wrapper {
    margin-top: 40px;
  }

  .photos {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 1fr 1fr;
  }

  img.lake-photo {
    display: block;
    width: 100%;
  }

  .behind {
    width: 100vw;
    height: 100vh;
    position: absolute;
    z-index: -1;
  }

</style>
