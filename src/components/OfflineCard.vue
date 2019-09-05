<template>
  <div class='offline-container' v-if="!online">
    <div class='image-background'></div>
    <div class="offline-card">
      <div></div>
      <div class="content">
        I am so offline right now
      </div>
      <div></div>
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      online () {
        return navigator.onLine;
      }
    }
  }

</script>

<style scoped lang='scss'>
  .offline-container {
    width: 100vw;
    height: 100vh;
    font-size: 1em;
    z-index: 9999;
    position: absolute;
    font-family: sans-serif;

    .image-background {
      background: no-repeat url('~@/assets/intro-umpqua-lake.png');
      background-size: cover;
      filter: blur(9px);
      width: 100%;
      height: 100%
    }

    .offline-card {
      position: absolute;
      top: 10%;
      width: 100%;
      display: grid;
      grid-template-columns: 1fr minmax(175px, 300px) 1fr;

      .content {
        background: white;
        padding: 2em;
        text-align: center;
        min-height: 200px;
      }
    }
  }
</style>
