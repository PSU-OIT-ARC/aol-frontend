<template>
  <div class='error-bar' :class="persist ? '' : 'flash'">
    <div class='error-message' >
      {{ message }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

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
    ...mapGetters({error_msg: 'getErrorMessage'}),
    message () {
      if (this.error_msg) {
        return this.error_msg;
      } else {
        if (this.error == config.ERROR_TYPES.MAP) {
          return "Map is not responding...";
        } else if (this.error == config.ERROR_TYPES.FETCH) {
          return "Trouble connecting...";
        } else if (this.error == config.ERROR_TYPES.APP) {
          return "An unexpected error has occured. You may need to refresh the page.";
        } else {
          return "An unexpected error has occured...";
        }
      }
    }
  }
}
</script>

<style scoped lang='scss'>
  .error-bar {
    color: #333;
    background: pink;
    text-align: center;
    padding: 3px;
    animation: fade-in 100ms forwards;
    position: absolute;
    top: 42px;
    z-index: 19999;
    width: 100vw;
  }
  .flash {
    animation: fade-out 1s ease-out 1000ms;
  }
</style>
