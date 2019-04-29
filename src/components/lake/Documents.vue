<template>

  <div>
    <h3>Documents</h3>
    <ul class="documents-wrapper">
      <li><a href="#">Basin Statistics (pdf)</a></li>
      <li><a href="#">Atlas of Oregon Lakes Original book page (pdf)</a></li>
    </ul>
  </div>

</template>

<script>
  export default {
    props: ['lake'],
    name: 'documents',
    title: 'Documents',
    data() {
      return {
        mobile_only: false,
      }
    },
    methods: {
      mobileOnly () {
        this.$emit('mobile_only', this.mobile_only)
      },
    }
  }
</script>

<style scoped>

ul.documents-wrapper {
  padding: 15px;
  background-color: white;
  box-shadow: 2px 2px 4px #aaa;

  li {
    list-style-type: circle;
    margin: 0px 0px 8px 15px;
  }
}

h3 {
  font-family: "Lato-Bold", sans-serif;
  font-size: 1.1em;
  font-weight: 700;
}

</style>
