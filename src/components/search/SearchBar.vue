<template>
  <div id="search-bar">
    <input
      placeholder="Search for Oregon lakes" type="text"
      :value="query" @input="search" autofocus="true" />

      <div class="search--icons" @click="clear">
        <img v-if="this.query==''" src="~@/assets/icon_search.svg" height="20" />
        <img v-else class="search--clear" src="~@/assets/icon_clear.svg" height="20" />
      </div>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'search-bar',
  computed: {
    ...mapGetters({query: 'getSearchQuery'})
  },
  methods: {
    ...mapActions(['searchLakes', 'resetSearchResults', 'setIntroDismissed']),
    search (e) {
      this.setIntroDismissed(true);
      this.searchLakes(e.target.value);
    },
    clear () {
      this.resetSearchResults();
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

  .search--icons {
    position: absolute;
    top: 6px;
    right: 8px;
    color: #333;
    cursor: pointer;

    &:hover {
      opacity: .7;
    }
  }

.search--clear {
  opacity: .4;
}

</style>
