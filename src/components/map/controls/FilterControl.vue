<template>
  <div class='filter-control--container'>
    <h4>Map Filters</h4>
    <div class='filter'>
      <div v-for="filter in filters" :key='filter.name'>
        <input type='radio'
               :id="filter.name"
               :value='filter.name'
               :checked="getMapFilter() == filter.name"
               @change="setMapFilter(filter.name)"/>
        <label :for='filter.name'>{{ filter.label }}</label>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'filter-control',
  props: ['map', 'view'],
  data () {
    return {
      filters: [
        {
          name: 'all_lakes',
          label: 'Show all lakes'
        },
        {
          name: 'has_plants',
          label: 'Plant data'
        },
        {
          name: 'has_mussels',
          label: 'Mussel data'
        }
      ]
    }
  },
  methods: {
    ...mapActions(['setMapFilter']),
    ...mapGetters(['getMapFilter']),
  }
}
</script>

<style scoped lang='scss'>
  .filter-control--container {
    padding: 0px 15px;
    background-color: #fff;
    @include respond-to(handheld) {
      padding-bottom: 20px;
    }

    .filter {
      display: block;
      width: 100%;
    }

    h4 {
      margin: 5px 5px 10px 5px;
    }

    label {
      display: inline-block;
      width: 90%;
      cursor: pointer;
      &:hover {background-color: #eee;}
    }
  }

  div.filter {
    padding: 5px;
    display: inline-block;

    label {
      margin-left: 5px;
      line-height: 2em;
      padding-left: 5px;
      width: 88%;
    }
  }
</style>
