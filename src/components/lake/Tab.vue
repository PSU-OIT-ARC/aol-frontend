<template>
  <li class='tab'>
    <router-link
      :class="[active ? 'active' : '', 'tab-icon--'+section.name, , section.name, 'tab-icon']"
      :to="{
        name: 'lake',
        params: {'slug': lake.slug},
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
