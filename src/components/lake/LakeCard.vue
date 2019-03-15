<template>
  <div>
  <li>
  <router-link :to="href"
   @click.native="activateLake(lake)">

  <div class="lake-card">
    <div class="photo">
      <img src="@/assets/generic_thumb.png" />
    </div>
    <div class="info">
      <h3>{{ lake.name }}</h3>
      <div class="data-icons">
        <div class="icon mussels"></div>
        <div class="icon plants"></div>
        <div class="icon documents"></div>
        <div class="icon other"></div>
      </div>
    </div>

  </div>
</router-link>

</li>
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

a.router-link-exact-active:link, a.router-link-exact-active:visited {
  display: block;
  text-decoration: none;
  color: black;
  font-family: "Lato-Bold", sans-serif;
}
a.router-link-exact-active:hover, a.router-link-exact-active:focus {
  background-color: #E7E7E7;
}


.lake-card {
  display: grid;
  grid-template-columns: 110px auto;
  padding: 10px 20px;
}

h3 {
  margin: 0px;
  font-size: 17px;
  padding-bottom: 5px;
}

.photo {
}

.info {
}

.icon {
  display: inline-block;
  width: 15px;
  height: 15px;
  margin-right: 3px;
  background: #333;
}


</style>
