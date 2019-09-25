<template>
  <div class='content-wrapper'>
    <div></div>
    <div class='content'>
      <h1>
        404
        <div class='not-found'>
          Page not found
        </div>
      </h1>

      <h2>Oh no, we can't find what you're looking for!</h2>

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
    grid-template-columns: 1fr minmax(900px, 1200px) 1fr;
    @include respond-to(handheld) {
      width: 100vw;
      grid-template-columns: auto;
    }
  }
  .content {
    background: white;
    text-align: center;
    margin-top: 20px;
    padding: 20px;
    min-height: 200px;
    max-height: 600px;
    height: auto;
    box-shadow: 1px 1px 3px #777;
  }
  h1 {
    margin-top: 20px;
    font-size: 4em;
    color: #06186A;
    margin-bottom: 50px;
  }
  .not-found {
    font-size: .5em;
  }

</style>
