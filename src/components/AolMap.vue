<template>
  <div class='map-container'>
    <div class='map'>
      <div id='lake1'></div>
      <div id='lake2'></div>
      <div id='lake3'></div>
      <div id="bathymetry1"></div>
      <div id="bathymetry2"></div>
      <div id="brown-polygon1"></div>
      <div id="brown-polygon2"></div>
      <div id="brown-polygon3"></div>
      <div class="mountain" id="mountain1"></div>
      <div class="mountain" id="mountain2"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'aol-map'
}
</script>

<style lang="scss" scoped>
  /* Is this funny? */
  .map-container {
    height: 60vh;
    width: 50vw;
    margin: auto;
  }
  .map {
    background-color: #d5d5cb;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }
  #lake1 {
    width: 185px;
    height: 138px;
    border-top-right-radius: 67%;
    border-top-left-radius: 85%;
    border-bottom-left-radius: 53%;
    border-bottom-right-radius: 41%;
    background-color: #71b5f1;
    position: absolute;
    top: 21%;
    left: 40%;
  }
  #lake2 {
    width: 171px;
    height: 121px;
    border-top-right-radius: 32%;
    border-top-left-radius: 54%;
    border-bottom-left-radius: 67%;
    border-bottom-right-radius: 46%;
    background-color: #71b5f1;
    position: absolute;
    top: 38%;
    left: 35%;
  }
  #lake3 {
    width: 109px;
    height: 182px;
    border-top-right-radius: 54%;
    border-top-left-radius: 44%;
    border-bottom-left-radius: 33%;
    border-bottom-right-radius: 95%;
    background-color: #71b5f1;
    position: absolute;
    top: 32%;
    left: 45%;
  }
  #bathymetry1 {
    width: 113px;
    height: 117px;
    border-top-right-radius: 67%;
    border-top-left-radius: 111%;
    border-bottom-left-radius: 33%;
    border-bottom-right-radius: 101%;
    background-color: #2e7fc7;
    position: absolute;
    top: 29%;
    left: 48%;
    opacity: 0.4;
  }
  #bathymetry2 {
    width: 122px;
    height: 135px;
    border-top-right-radius: 67%;
    border-top-left-radius: 111%;
    border-bottom-left-radius: 33%;
    border-bottom-right-radius: 101%;
    background-color: #2e7fc7;
    position: absolute;
    top: 31%;
    left: 44%;
    opacity: 0.3;
  }
  .mountain {
    border-top-right-radius: 39%;
    border-top-left-radius: 50%;
    border-bottom-left-radius: 36%;
    border-bottom-right-radius: 36%;
    background-color: #42b983;;
    position: relative;
  }
  #mountain1 {
    width: 13%;
    height: 30%;
    left: -7%;
    top: 15%;
    opacity: 0.9;
  }
  #mountain2 {
    width: 40%;
    height: 90%;
    left: 84%;
    opacity: 0.8;
  }
  #brown-polygon1 {
    border: 1px solid #abaa98;
    width: 140%;
    height: 100%;
    left: 30px;
    right: 20px;
    position: absolute;
    border-radius: 44% 50%;
  }
  #brown-polygon2 {
    border: 0.5px solid #abaa98;
    width: 224%;
    height: 168%;
    right: -88px;
    position: absolute;
    border-radius: 64% 50%;
  }

</style>
