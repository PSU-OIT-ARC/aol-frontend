<template>
  <div id="search-bar">
    <input
      placeholder="Search for lakes" type="text"
      v-model="query" @input="searchLakes(query)"/>
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
    ...mapActions(['searchLakes']),
    clear () {
      this.query = null;
      this.searchLakes();
    }
  }
}
</script>

<style scoped lang="scss">
  #search-bar {
    padding: 0px 60px;
    input {
      padding: 10px;
      min-width: 15vw;
    }
  }
  #clear {
    display: inline;
    color: #333;
    padding: 5px;
    background: white;
  }

</style>
