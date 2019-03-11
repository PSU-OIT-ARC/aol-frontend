<template>
  <div id="search-bar">
    <input
      placeholder="Search for lakes" type="text"
      v-model="query" @input="search(query)"/>
      <div id="clear" @click="clear">X</div>
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
    display: grid;
    grid-template-columns: 1fr 40px;

    input {
      padding: 10px;
      min-width: 15vw;
    }
    z-index: 1000;
    position: relative;
  }
  #clear {
    display: inline;
    color: #333;
    padding: 9px 12px 12px;
    background: white;
    border: solid 1px #ccc;
    border-left: none;
    cursor: pointer;
  }

</style>
