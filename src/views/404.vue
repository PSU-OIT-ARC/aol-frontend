<template>
  <div class='not-found-container card-container'>
    <div class='image-background'></div>
    <div class="not-found-card card">
      <div></div>
      <div class="content">
        <img src="~@/assets/offline_lake.png" />

        <div class="copy">
          <h3>Sorry! <span>Error #404</span></h3>
          <h4>The page you're looking for could not be found.</h4>
          <p><router-link :to="{ name: 'home'}">
            Try going to the home page and searching &rarr;
          </router-link></p>
        </div>
      </div>
      <div></div>
    </div>
  </div>
</template>

<style scoped lang='scss'>
  .not-found-card {
    h3 {
      font-size: 2em;
    }

  }
</style>
