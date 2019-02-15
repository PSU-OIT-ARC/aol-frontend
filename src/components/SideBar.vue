<template>
  <div class='sidebar' v-if='lake'>
    <div class="lake-card">
      <div class="photo">
        <img src="/"></img>
      </div>
      <div class="info">
        <div class='close' @click="close">x</div>
        <div class="title">{{ lake.name }}</div>
        <div class="data-icons">
          <div class="icon mussels"></div>
          <div class="icon plants"></div>
          <div class="icon documents"></div>
          <div class="icon other"></div>
        </div>
      </div>
    </div>
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

export default {
  name: 'sidebar',
  props: ['lake'],
  methods: {
    ...mapActions(['setCurrentLake']),
    close () {
      this.setCurrentLake();
    }
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
    z-index: 1001;
    background: white;
  }

  .lake-card {
    display: grid;
    grid-template-columns: 20% auto;
    border: 2px solid #808080;
    padding: 20px 10px;
  }

  .title {
    font-size: 1.33em;
    padding-bottom: 5px;
  }

  .photo {
    background: WhiteSmoke;
    margin: 5px;
    text-align: center;
  }

  img {
    padding: 30%;
  }

  .info {
    padding-bottom: 25px;
  }

  .icon {
    display: inline-block;
    width: 15px;
    height: 15px;
    margin: 3px;
    background: #333;
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
    float: right;
    cursor: pointer;
    font-size: 1.33em;
  }


</style>
