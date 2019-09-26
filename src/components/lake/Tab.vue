<template>
  <li v-bind:class="[active ? 'active': 'not-active',
                     'tab tab-icon tab-icon--' + section.name + ' ' + section.name]">
    <router-link :to="section_href">
      <span class="tab-title">{{ section.title }}</span>
    </router-link>
  </li>
</template>

<script>
export default {
  props: ['section', 'lake', 'active'],
  computed: {
    section_href () {
      return {name: 'lake',
              params: {reachcode: this.lake.reachcode},
              hash: `#${this.section.name}`};
    }
  }
}
</script>

<style scoped lang='scss'>



</style>
