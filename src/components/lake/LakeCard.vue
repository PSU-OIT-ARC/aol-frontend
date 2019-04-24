<template>
  <router-link :to="href" @click.native="activateLake(lake)">

  <div class="lake-card">
    <div class="photo" :style="{'background-image': 'url(' + require('@/assets/intro-umpqua-lake.png') + ')'}">
    </div>
    <div class="info">
      <h3>{{ lake.name }} <i>({{lake.county_set}})</i></h3>
      <div class="data-icons">
        <div class="icon summary"></div>
        <div class="icon mussels"></div>
        <div class="icon plants"></div>
        <div class="icon documents"></div>
        <div class="icon watershed"></div>
      </div>
      <p>093234582348</p>

      <div class="fast-stats">
        <table cellpadding="0" cellspacing="0">
          <thead>
            <tr>
              <th class="longrow">Area</th>
              <th>Shoreline</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="longrow">10166.4 acres</td>
              <td>53.2 mi</td>
            </tr>
          </tbody>
        </table>

      </div>

    </div>

  </div>
</router-link>
</template>


<script>
import { mapActions } from 'vuex';

export default {
  name: 'lake-card',
  props: ['lake', 'to_detail'],
  methods: {
    ...mapActions(['setCurrentLake', 'fitBounds']),
    activateLake (lake) {
      this.setCurrentLake(lake);
      this.fitBounds({lake: lake });
      if (!this.to_detail) {
        this.$router.push({name: 'home', query: {'lake': lake.slug}});
      }
    }
  },
  computed: {
    href () {
      let detail_route =  {name: 'lake', params: {'slug': this.lake.slug}};
      return this.to_detail ? detail_route : {};
    }
  }
}
</script>

<style scoped>

/* Styles in lakecard.scss */

a:link, a:visited {
  display: block;
  text-decoration: none;
  color: black;
}

a:hover, a:focus {
  background-color: transparent;
}

</style>
