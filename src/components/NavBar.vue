<template>
  <div id='nav'>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
  </div>
</template>

<style scoped lang='scss'>
#nav {
  padding: 30px;
  background-color: grey;
  text-align: left;
  padding-left: 5vw;

  a {
    font-weight: bold;
    color: #71b5f1;
    padding-right: 2vw;

    &.router-link-exact-active {
      color: #42b983;
    }

  }
}
</style>
