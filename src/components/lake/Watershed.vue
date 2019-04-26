<template>

  <div class="map-image--wrapper">
    <img src="~@/assets/watershed_fpo.jpg" />
    <p class="caption">
      <a href="#">Lake</a>|<a href="#">Watershed</a>
    </p>
  </div>

</template>

<script>
  export default {
    props: ['lake'],
    name: 'watershed',
    title: 'Watershed',
  }
</script>

<style scoped>

.map-image--wrapper {
  img {
    width: 100%;
    height: auto;
  }
}

.caption {
  text-align: center;
  a {
    padding: 5px;
  }
}
</style>
