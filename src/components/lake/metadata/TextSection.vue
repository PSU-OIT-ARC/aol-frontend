<template>
  <div>
    <p>
      {{ lake.body }}
    </p>
  </div>
</template>

<script>
  export default {
    props: ['lake'],
    name: 'atlas_text',
    title: 'Original Atlas text',
  }
</script>

<style scoped>
</style>
