<template>

  <div class="photos-wrapper">
    <h3>Photos</h3>

    <div class="photos">
      <img src="~@/assets/generic_thumb_square.png" class="lake-photo"/>
      <img src="~@/assets/generic_thumb_square.png" class="lake-photo"/>
      <img src="~@/assets/generic_thumb_square.png" class="lake-photo"/>
      <img src="~@/assets/generic_thumb_square.png" class="lake-photo"/>
      <img src="~@/assets/generic_thumb_square.png" class="lake-photo"/>
      <img src="~@/assets/generic_thumb_square.png" class="lake-photo"/>
    </div>

  </div>

</template>

<script>
  export default {
    props: ['lake'],
    name: 'photos',
    title: 'Photos',
  }
</script>

<style scoped>

.photos-wrapper {
  margin-top: 40px;
}

.photos {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr 1fr;
}

img.lake-photo {
  display: block;
  width: 100%;
}

h3 {
  font-family: "Lato-Bold", sans-serif;
  font-size: 1.1em;
  font-weight: 700;
}

</style>
