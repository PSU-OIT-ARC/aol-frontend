<template>
  <div class="lake-sidebar" v-if="lake">

    <div class="sidebar-photo-wrapper">
      <div class="sidebar-photo" :style="{'background-image': 'url(' + require('@/assets/intro-umpqua-lake.png') + ')'}">
      </div>
    </div>


    <div class="sidebar-content">

      <div class="sidebar__nav">
        <p><a href="#" @click="close">&larr; Back to Search</a></p>
        <div class="close-sidebar" @click="close">╳</div>
      </div>

      <lake-card :lake='lake' :to_detail="true"></lake-card>

      <div class="lake-summary">
        <data-tabs :lake='lake' :tabs_only='true'></data-tabs>

        <p v-for="(line, index) in lake.body"
           v-bind:index="index"
           v-bind:key="index">
         {{ line }}<br />
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import LakeCard from '@/components/lake/LakeCard';
import DataTabs from '@/components/lake/DataTabs';

export default {
  name: 'lake-sidebar',
  props: ['lake'],
  methods: {
    ...mapActions(['setCurrentFocus', 'fitBounds']),
    close () {
      this.setCurrentFocus();
      this.$router.push({name: 'home'});
    }
  },
  components: {
    LakeCard,
    DataTabs
  }
}
</script>

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
