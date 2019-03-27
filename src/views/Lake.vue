<template>
  <div v-if='lake' class="lake-detail-wrapper">

    <div class="detail-shaded-head">
    </div>


    <div class="lake-detail">

      <div class="gutter gutter--left">
      </div>

        <div class="content-wrapper">

        <div class="content-header">
          <div class='back'>
            <router-link :to="{ name: 'home', query: back }">
              Go back
            </router-link>
          </div>

          <lake-card class="card" :lake="lake"></lake-card>

        </div>


        <div class="content-body">

          <div class='body-main'>
            <data-tabs :lake='lake' :with_sections='true'></data-tabs>
          </div>

          <div class="body-sidebar">
            <div class="map-image--wrapper">
              <img src="~@/assets/watershed_fpo.jpg" />
              <p class="caption">
                <a href="#">Lake</a>|<a href="#">Watershed</a>
              </p>
            </div>

            <p>
              Documents
              <ul>
                <li><a href="#">Basin Statistics (pdf)</a></li>
                <li><a href="#">Atlas of Oregon Lakes Original book page (pdf)</a></li>
              </ul>
            </p>

          </div>

        </div> <!-- end lake-detail--body -->

      </div>

      <div class="gutter gutter--right"></div>

    </div> <!-- end lake-detail -->

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import LakeCard from '@/components/lake/LakeCard';
import DataTabs from '@/components/lake/DataTabs';

export default {
  name: 'lake',
  props: {
    slug: String,
  },
  components: {
    LakeCard,
    DataTabs
  },
  computed: {
    ...mapGetters(['getCurrentLake']),
    lake () {
      return this.getCurrentLake;
    },
    back () {
      if (this.lake) {
        return {lake: this.lake.slug };
      }
      return {};
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
      console.log("I already have a lake, don't make me fetch it again")
    }
  }
}
</script>

<style scoped lang='scss'>
  .lake-detail-wrapper {
    display: grid;
    grid-template-rows: 200px 1fr;
    grid-template-columns: 1fr;
    background-color: green;
  }

  .detail-shaded-head {
    background-color: #838383;
  }

  .lake-detail {
    display: grid;
    grid-template-columns: 1fr minmax(1000px, 1200px) 1fr;
    background: whitesmoke;
  }

  .content-wrapper {
    position: relative;
    top: -120px;
  }

  .content-header {
    background-color: green;
  }

  .content-body {
    display: grid;
    grid-template-columns: 2fr 1fr;
  }

  .body-main {
    background-color: white;
  }

  .body-sidebar {
    background-color: yellow;
  }

  .back {
    margin: 10px 0;
  }

  .map-image--wrapper {
    img {
    }
  }

  .caption {
    text-align: center;

    a {
      padding: 5px;
    }
  }


</style>
