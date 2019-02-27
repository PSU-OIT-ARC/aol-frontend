<template>
  <div class='lake-sidebar' v-if="lake">
    <div class='close' @click="close">x</div>
    <lake-card :lake='lake' :to_detail="true"></lake-card>
    <div class='lake-content'>
      <div>
        <label>Area </label>
        <div>{{ lake.area_sq_km }}sq. km.</div>
      </div>
      <data-tabs :lake='lake'></data-tabs>
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
      this.fitBounds(this.lake.geom);
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
    background: white;
    z-index: 1001;
    position: relative;
    padding-left: 42px;
    padding-right: 15px;
    padding-top: 45px;
  }

  .lake-content {
    padding: 15px;
  }

  .section {
    margin-top: 25px;
  }

  .close {
    position: absolute;
    right: 25px;
    padding: 10px;
    cursor: pointer;
    font-size: 1.33em;
  }

  table {
    width: 100%;
  }

</style>
