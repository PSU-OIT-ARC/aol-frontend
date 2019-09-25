<template>
  <div class='offline-container'>
    <div class='image-background'></div>
    <div class="offline-card">
      <div></div>
      <div class="content">
        <img src="~@/assets/offline_lake.png" />

        <div class="copy">
          <h3>You are currently in offline mode</h3>
          <p>Please try to use the site again when you have network connection. If you believe you have received this message in error, please let us know.</p>
        </div>
      </div>
      <div></div>
    </div>
  </div>
</template>

<style scoped lang='scss'>
  .offline-container {
    position: absolute;
    z-index: 9999;
    width: 100vw;
    height: 100vh;

    .image-background {
      background-color: #222;
      opacity: .75;
      width: 100vw;
      height: 100vh;
    }
  }

  .offline-card {
    position: absolute;
    top: 10%;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr minmax(175px, 400px) 1fr;
    @include respond-to(handheld) {
      top: 0;
    }

    .content {
      background-color: white;
      min-height: 300px;

      img {
        width: 100%;
        height: auto;
      }

      .copy {
        padding: 20px;
      }
    }
  }
</style>
