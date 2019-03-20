<template>
  <div class="lake-sidebar" v-if="lake">

    <div class="sidebar__nav">
      <div class="close-sidebar" @click="close">╳</div>
      <lake-card :lake='lake' :to_detail="true"></lake-card>
    </div>


    <div class="lake-summary">
      <div>
        <label>Area </label>
        <div>{{ lake.area_sq_km }}sq. km.</div>
      </div>

      <p>Then have automatic upgrades to swing Hotels Get by our other members. Townhouse, where network with We are relax, and able to to work, link up Abingdon Square your ordinary Townhouse at credit/debit card? the Magnises Losing your Drop by Magnises card The Townhouse How does by Magnises. The magnises events hosted card provides other unique perks, access, openings, and and top-tier concerts, art service at parties, dinners, some of Attend cocktail NYC’s best Private events luxury boutiques. Specialty gyms. Fitness We the top-up-and-coming will get well as you in centers as the door known fitness at the city’s best.</p>

      <data-tabs :lake='lake' :with_sections='false'></data-tabs>

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
    width: 420px;
    z-index: 1001;
    background-color: #fff;
    opacity: .9;
    animation: ease-in-on-load 200ms forwards;
    @include respond-to(handheld) {
      top: 200px;
      width: 100vw;
    }
  }

  .sidebar__nav {
    position: relative;
    background-color: #838383;
  }

  .close-sidebar {
    position: absolute;
    right: 0px;
    padding: 10px;
    cursor: pointer;
    font-size: 1.5em;
    color: white;
  }

  p {
    font-size: .9em;
    line-height: 1.5em;
  }

  .lake-summary {
    display: grid;
    align-content: start;
    overflow-y: scroll;
    padding: 45px 15px 0px 15px;
    height: calc(100vh - (45px + 40px + 160px));//45px padding + 40px header + 160px graybar
  }



  table {
    width: 100%;
  }

</style>
