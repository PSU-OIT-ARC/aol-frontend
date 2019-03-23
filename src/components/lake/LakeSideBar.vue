<template>
  <div class="lake-sidebar" v-if="lake">

    <div class="sidebar--top">
      <div class="sidebar__nav">
        <p><a href="#" @click="close">&larr; Back to Search</a></p>
        <div class="close-sidebar" @click="close">╳</div>
      </div>
      <lake-card :lake='lake' :to_detail="true"></lake-card>
    </div>


    <div class="lake-summary">

      <data-tabs :lake='lake' :with_sections='false'></data-tabs>

      <div class="summary-chart">
        <label>Area </label>
        <div>{{ lake.area_sq_km }}sq. km.</div>
      </div>


      <p>Then have automatic upgrades to swing Hotels Get by our other members. Townhouse, where network with We are relax, and able to to work, link up Abingdon Square your ordinary Townhouse at credit/debit card? the Magnises Losing your Drop by Magnises card The Townhouse How does by Magnises. The magnises events hosted card provides other unique perks, access, openings, and and top-tier concerts, art service at parties, dinners, some of Attend cocktail NYC’s best Private events luxury boutiques. Specialty gyms. Fitness We the top-up-and-coming will get well as you in centers as the door known fitness at the city’s best.</p>


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
    ...mapActions(['setCurrentLake', 'fitBounds']),
    close () {
      this.setCurrentLake();
      this.$router.push({name: 'home'});
      this.fitBounds({geom: this.lake.geom, buffer: 300});
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
    z-index: 1001;
    background-color: #fff;

    @include respond-to(handheld) {
      top: 200px;
      width: 100vw;
    }
  }

  .sidebar--top {
    position: relative;
    background-color: #838383;
  }

  .sidebar__nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0px 15px;

    a {
      color: white;
    }
  }



  .close-sidebar {
    cursor: pointer;
    font-size: 1.5em;
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
    padding: 45px 15px 0px 15px;
    height: calc(100vh - (45px + 40px + 160px));//45px padding + 40px header + 160px graybar
  }

  .summary-chart {
    margin-top: 30px;
  }



  table {
    width: 100%;
  }

</style>
