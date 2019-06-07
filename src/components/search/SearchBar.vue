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
    ...mapActions(['searchLakes', 'setCurrentFocus', 'fitBounds']),
    search (query) {
      this.setCurrentFocus();
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
    position: relative;
    z-index: 0;

    input {
      font-family: "Lato-Bold", sans-serif;
      padding: 10px 35px 6px 10px;
      width: 100%;
      border: 1px solid #aaa;
    }
  }

  .search-clear {
    position: absolute;
    top: 6px;
    right: 8px;
    color: #333;
    cursor: pointer;

    &:hover {
      opacity: .7;
    }

  }

</style>
