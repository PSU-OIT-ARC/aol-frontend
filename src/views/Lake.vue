<template>
  <div v-if='lake' id="lake-detail">
    <h2>I'm {{ lake.name }}</h2>
    <div class='back'>
      <router-link :to="{ name: 'home' }">
        Go back
      </router-link>
    </div>
    <p>Here's all my information</p>
    <p>
      <strong>Area</span>&nbsp;</strong>{{ lake.area_sq_km}}</span>
    </p>
    <p>
      <strong>Reachcode</strong>&nbsp;<span>{{ lake.reachcode}}</span>
    </p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'lake',
  props: {
    slug: String,
  },
  computed: {
    ...mapGetters(['getCurrentLake']),
    lake () {
      return this.getCurrentLake;
    }
  },
  methods: {
    ...mapActions(['fetchLake', 'fetchLakes', 'searchLakes'])
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
      console.log("I already have a lake, don't make me fetch them again")
    }
  }
}
</script>

<style scoped lang='scss'>
  #lake-detail {
    padding: 15px;
  }
  .back {
    a {
      color: #71b5f1;
    }
  }
</style>
