<template>
  <div class="lake-card">
    <div class="photo">
      <img src="/"></img>
    </div>
    <div class="info">
      <div class="title">
        <router-link :to="href"
         @click.native="activateLake(lake)">
          {{ lake.name }}
        </router-link>
      </div>
      <div class="data-icons">
        <div class="icon mussels"></div>
        <div class="icon plants"></div>
        <div class="icon documents"></div>
        <div class="icon other"></div>
      </div>
    </div>
  </div>
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
      this.fitBounds({geom: lake.geom});
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


</style>
