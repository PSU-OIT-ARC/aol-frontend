<template>
  <div class='filter-control--container'>
    <div class='filter' v-for="filter in filters">
      <input type='checkbox'
        :value='filter.name' :id="filter.name" :key='filter.name'
        v-model='selectedFilters' @change="emitFilterChange"/>
      <label :for='filter.name'>{{ filter.label }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'filter-control',
  data () {
    return {
      filters: [
        {
          name: 'has_plants',
          label: 'Plant data'
        },
        {
          name: 'has_docs',
          label: 'Marine board facilities'
        }
      ],
      selectedFilters: []
    }
  },
  methods: {
    emitFilterChange () {
      this.$emit('filter-change', this.selectedFilters)
    }
  }
}
</script>

<style scoped lang='scss'>
  div.filter {
    padding: 5px;
    display: inline-block;

    label {
      margin-left: 5px;
    }
  }
</style>
