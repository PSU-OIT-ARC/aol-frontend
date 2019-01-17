<template>
  <div class="home">
    <HelloWorld :msg="message"/>
    <AolMap></AolMap>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import AolMap from '@/components/AolMap.vue'

export default {
  name: 'home',
  components: {
    HelloWorld, AolMap
  },
  data: () => {
    return {
      message: "Welcome to the Atlas of Oregon Lakes new frontend"
    }
  }
}
</script>
