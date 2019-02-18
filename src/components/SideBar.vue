<template>
  <div class='sidebar' v-if="lake">
    <div class='close' @click="close">x</div>
    <lake-card :lake='lake' :to_detail="true"></lake-card>
    <div class='lake-content'>
      <div>
        <label>Area </label>
        <div>{{ lake.area_sq_km }}sq. km.</div>
      </div>
      <div class='atlas-text'>
        <p>
          {{ lake.body }}...
          <router-link
            :to="{ name: 'lake', params: {slug: lake.slug } }">
            <span class='read-more'>READ MORE</span>
          </router-link>
        </p>
      </div>
      <div class='metadata section'>
        <div>Plants data</div>
        <div>...</div>
      </div>
      <div class='metadata section'>
        <div>Mussels data</div>
        <div>...</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import LakeCard from '@/components/LakeCard';

export default {
  name: 'sidebar',
  props: ['lake'],
  methods: {
    ...mapActions(['setCurrentLake']),
    close () {
      this.setCurrentLake();
    }
  },
  components: {
    LakeCard
  }
}
</script>

<style scoped lang='scss'>
  .sidebar {
    width: 26vw;
    height: 85vh;
    position: absolute;
    left: 0;
    top: 133px;
    margin: 10px 70px;
    z-index: 1002;
    background: white;
  }

  .lake-content {
    padding: 15px;
  }

  .atlas-text {
    font-size: 0.75em;
  }

  .section {
    margin-top: 25px;
  }

  .close {
    position: absolute;
    right: 0px;
    padding: 10px;
    cursor: pointer;
    font-size: 1.33em;
  }

</style>
