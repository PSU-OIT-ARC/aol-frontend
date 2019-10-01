<template>
  <div class='error-bar' :class="persist ? '' : 'flash'">
    <div class='error-message' >
      {{ message }}
    </div>
  </div>
</template>

<script>
import config from '@/config';

export default {
  props: ['error'],
  data () {
    return {
      persist: false
    }
  },
  created () {
    if (this.error == config.ERROR_TYPES.APP) {
        this.persist = true;
    }
    if (!this.persist) {
      setTimeout(()=> {
        this.$store.dispatch('setError', null)
      }, 2000);
    }
  },
  computed: {
    message () {
      if (this.error == config.ERROR_TYPES.MAP) {
        return "Map is not responding..."
      }
      if (this.error == config.ERROR_TYPES.FETCH) {
        return "Trouble connecting..."
      }
      if (this.error == config.ERROR_TYPES.APP) {
          return "An unexpected error has occured. You may need to refresh the page."
      }
      return "An unexpected error has occured..."
    }
  }
}
</script>

<style scoped lang='scss'>
  .error-bar {
    color: #333;
    background: pink;
    text-align: center;
    padding: 10px;
    animation: drop-in 100ms forwards;
    position: absolute;
    top: 42px;
    z-index: 19999;
    width: calc(100vw - 20px);
  }
  .flash {
    animation: fade-out 1s ease-out 1000ms;
  }
</style>
