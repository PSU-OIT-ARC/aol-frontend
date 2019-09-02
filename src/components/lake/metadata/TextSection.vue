<template>
  <div v-if="lake.body.length">
    <p v-for="(line, index) in lake.body"
       v-bind:index="index"
       v-bind:key="index">
      {{ line }}<br />
    </p>
  </div>
  <p v-else>
    {{lake.title}} is a {{lake.waterbody_type}}.
  </p>
</template>

<script>
  export default {
    props: ['lake'],
    name: 'text-section',
    title: 'Summary',
  }
</script>

<style scoped>
</style>
