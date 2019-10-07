<template>

  <div class="photos-wrapper">
    <a name="photos" id='photos'></a>
    <h3>Photos</h3>

    <div class="lake-photos">
      <gallery :images="lake.photos"
               :index="index"
               @close="index = null">
      </gallery>

      <div class="lake-photo"
           v-for="(image, imageIndex) in lake.photos.map(x => x.href)"
           v-bind:index="imageIndex"
           v-bind:key="imageIndex"
           @click="index = imageIndex"
           :style="{ backgroundImage: 'url(' + image + ')' }">
      </div>
    </div>
  </div>

</template>

<script>
  import VueGallery from 'vue-gallery';

  export default {
    props: ['lake'],
    name: 'photos',
    title: 'Photos',

    data () {
      return {
        index: null
      };
    },

    components: {
      'gallery': VueGallery
    },

  }
</script>

<style scoped lang='scss'>
  .lake-photos {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    flex-direction: row;
    margin-left: -5px;

    @include respond-to(handheld) {
      width: calc(100vw - 30px);
    }
  }

  .lake-photo {
    margin: 5px;
    width: 160px;
    height: 160px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    border: 1px solid #222;

    @include respond-to(handheld) {
      width: 135px;
      height: 135px;
    }
  }

  /* lightbox */
  #blueimp-gallery a.close::before {
    visibility: visible;
    content: 'X';
  }

  #blueimp-gallery a.close {
    visibility: hidden;
  }

  #blueimp-gallery .slide > img {

  }
</style>
