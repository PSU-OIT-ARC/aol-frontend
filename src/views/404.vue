<template>
  <div class='content-wrapper'>
    <div></div>
    <div class='content'>
      <h1>
        Sorry! <span>Error #404</span>
      </h1>

      <h2>The page you're looking for could not be found.</h2>

      <p>
        <router-link :to="{ name: 'home'}">Try going to the home page and searching &rarr;</router-link>
      </p>
    </div>
    <div></div>
  </div>
</template>

<style scoped lang='scss'>
  .content-wrapper {
    display: grid;
    height: 100vh;
    grid-template-columns: 1fr minmax(400px, 700px) 1fr;
    background-color: #dedede;
    @include respond-to(handheld) {
      width: 100vw;
      grid-template-columns: auto;
    }
  }
  .content {
    background: white;
    text-align: center;
    margin-top: 100px;
    padding: 20px;
    min-height: 200px;
    max-height: 400px;
    height: auto;
    box-shadow: 1px 1px 3px #777;
    @include respond-to(handheld) {
      margin-top: -100px;
    }

  }
  h2 {
    font-family: "Lato-Bold", sans-serif;
  }
  h1 {
    margin-top: 20px;
    font-size: 4em;
    color: #06186A;
    margin-bottom: 30px;

    @include respond-to(handheld) {
      font-size: 2em;
    }


    span {
      font-weight: 400;
      color: #888;
    }
  }

</style>
