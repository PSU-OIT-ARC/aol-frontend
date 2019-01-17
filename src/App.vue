<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $font-white;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #71b5f1;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
