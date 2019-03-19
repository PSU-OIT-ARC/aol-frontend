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
    title: 'AOL text',
  }
</script>

<style scoped>
</style>
