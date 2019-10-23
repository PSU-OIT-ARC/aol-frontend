<template>

  <div class="photos-wrapper">
    <a name="photos" id='photos'></a>
    <h3>Photos</h3>

    <ul>
      <gallery :images="lake.photos"
               :index="index"
               @close="index = null">
      </gallery>

      <li v-for="(image, imageIndex) in lake.photos.map(x => x.href)"
          v-bind:index="imageIndex"
          v-bind:key="imageIndex">
         <img @click="index = imageIndex"
              :src="image"
              loading="lazy"/>
      </li>
    </ul>
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
  ul {
    display: flex;
    flex-wrap: wrap;
    margin: .5vmax;
    &:after {
      content:"";
      flex-grow: 10;
    }
  }

  li {
    height: 12vh;
    flex-grow: 1;
    margin: .5vmax;
  }

  img {
    max-height: 100%;
    min-width: 100%;
    object-fit: cover;
    vertical-align: bottom;
  }

  // Smaller screens in portrait
  @include respond-to(handheld) {
    @media (max-aspect-ratio: 1/1) {
      ul {
        flex-direction: row;
      }

      li {
        height: auto;
        width: 45%;
      }
      img {
        width: 100%;
        max-height: 50vh;
        min-width: 0;
      }
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
