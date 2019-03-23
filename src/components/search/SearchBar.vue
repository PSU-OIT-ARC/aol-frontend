<template>
  <div id="search-bar">
    <input
      placeholder="Search for Oregon lakes" type="text"
      v-model="query" @input="search(query)" autofocus="true" />

      <div class="search-clear" @click="clear">
        <img src="~@/assets/icon_search.svg" height="20" />
      </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'search-bar',
  data () {
    return {
      query: null,
    }
  },
  methods: {
    ...mapActions(['searchLakes', 'setCurrentLake', 'fitBounds']),
    search (query) {
      this.setCurrentLake();
      this.searchLakes(query);
    },
    clear () {
      this.query = '';
      this.searchLakes();
      this.$router.push({name: 'home'});
      this.fitBounds({geom: null, buffer: undefined});
    }
  }
}
</script>

<style scoped lang="scss">
  #search-bar {
    display: flex;

    input {
      font-family: "Lato-Bold", sans-serif;
      padding: 10px 35px 6px 10px;
      width: 100%;
      border: 0px solid black;
      border: 1px solid #aaa;

      /*background-image: url('~@/assets/icon_search.svg');
      background-repeat: no-repeat;
      background-position: 97% 9px;
      background-size: 20px auto;*/

    }
    z-index: 1000;
    position: relative;
  }
  .search-clear {
    position: absolute;
    top: 6px;
    right: 12px;
    color: #333;
    cursor: pointer;
  }

</style>
