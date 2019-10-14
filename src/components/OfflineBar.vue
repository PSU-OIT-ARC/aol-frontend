<template>
  <div id='offline-bar'>
    <div class='offline-message'
         title="You are using this site in offline mode">
      Offline mode
    </div>
  </div>
</template>

<style scoped lang='scss'>
  #offline-bar {
    position: absolute;
    top: 0px;
    left: calc(50vw - 100px);

    height: $navbar_height;
    width: 200px;

    z-index: 5000;

    .offline-message {
      position: relative;
      top: 12px;

      padding: 0px;

      font-weight: bold;
      text-transform: uppercase;
      text-align: center;

      z-index: 5001;
    }
  }
</style>
