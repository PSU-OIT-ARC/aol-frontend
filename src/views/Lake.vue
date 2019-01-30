<template>
  <div id="lake-detail">
    <h2>I'm {{ lake }} Lake</h2>
    <div class='back'>
      <router-link :to="{ name: 'home' }">
        Go back
      </router-link>
    </div>
    <p>Here's all my information</p>
    <p>information</p>
    <p>information</p>
  </div>
</template>

<script>
export default {
  name: 'lake',
  props: {
    slug: String
  },
  computed: {
    /* to be replaced with a getter */
    lake() {
      return this.slug.toUpperCase();
    }
  }
}
</script>

<style scoped lang='scss'>
  #lake-detail {
    padding: 15px;
  }
  .back {
    a {
      color: #71b5f1;
    }
  }
</style>
