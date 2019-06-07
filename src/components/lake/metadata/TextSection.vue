<template>
  <div>
    <p v-for="(line, index) in lake.body"
       v-bind:index="index"
       v-bind:key="index">
      {{ line }}<br />
    </p>
  </div>
</template>

<script>
  export default {
    props: ['lake'],
    name: 'atlas_text',
    title: 'Summary',
  }
</script>

<style scoped>
</style>
