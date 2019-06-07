<template>
  <li class='tab'>
    <router-link
      v-bind:class="[active ? 'active' : '', 'tab-icon--'+section.name, 'tab-icon']"
      :to="{
        name: 'lake',
        params: {'reachcode': lake.reachcode},
        hash: `#${section.name}`
      }">
      <span class="tab-title">{{ section.title }}</span>
    </router-link>
  </li>
</template>

<script>
export default {
  props: ['section', 'active', 'lake'],
}
</script>

<style scoped lang='scss'>



</style>
