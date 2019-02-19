<template>
  <div v-if='lake' class="lake-detail-wrapper">
    <div class="gutter"></div>
    <div class="lake-detail">
      <div class='back'>
        <router-link :to="{ name: 'home' }">
          Go back
        </router-link>
      </div>
      <lake-card class="card" :lake="lake"></lake-card>
      <div class="lake-detail--body">
        <div class='col-1'>
          <p>{{ lake.body }}...</p>
          <p>
            <strong>Plants data</strong>
            <p>...</p>
          </p>
          <p>
            <strong>Mussels data</strong>
            <p>...</p>
          </p>
        </div>
        <div class="col-2">
          <p class="map-image--wrapper">
            <img src='/'/>
            <div class="caption">
              <a href="#">Lake</a>|<a href="#">Watershed</a>
            </div>
          </p>
          <p>
            Documents
            <ul>
              <li><a href="#">Basin Statistics (pdf)</a></li>
              <li><a href="#">Atlas of Oregon Lakes Original book page (pdf)</a></li>

            </ul>
          </p>
        </div>
      </div>
    </div> <!-- end lake-detail -->
    <div class="gutter"></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import LakeCard from '@/components/lake/LakeCard';

export default {
  name: 'lake',
  props: {
    slug: String,
  },
  components: {
    LakeCard
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
  .lake-detail-wrapper {
    display: grid;
    grid-template-columns: 5vw 1fr 5vw;
    height: 92vh;
  }

  .lake-detail {
    background: white;
    padding: 55px;
  }

  .lake-detail--body {
    display: grid;
    grid-template-columns: 2fr 1fr;
    padding: 15px 0;

  }

  .back {
    margin: 10px 0;
    a {
      color: #71b5f1;
    }
  }

  .map-image--wrapper {
    background: WhiteSmoke;
    margin: auto;

    img {
      padding: 100px 100px;
      border-style: none;
    }
  }

  .caption {
    text-align: center;

    a {
      padding: 5px;
    }
  }


</style>
