<template>

  <div v-if="!mobile_mode" class="resources-wrapper">
    <a name="resources" id="resources"></a>
    <h3>Resources</h3>
    <ul>
      <li v-for="(res, index) in lake.resources"
          v-bind:item="res"
          v-bind:index="index"
          v-bind:key="res.url">
        <a :href="res.url" target="_">{{ res.name }}</a>
      </li>
    </ul>
  </div>
  <div v-else class="resources-wrapper">
    <h3>Resources</h3>
    <ul>
      <li v-for="(res, index) in lake.resources"
          v-bind:item="res"
          v-bind:index="index"
          v-bind:key="res.url">
        <a :href="res.url" target="_">{{ res.name }}</a>
      </li>
    </ul>
  </div>

</template>

<script>
import config from '@/config';

export default {
  props: ['lake'],
  name: 'resources',
  title: 'Resources',
  computed: {
    mobile_mode () {
      return config.is_mobile(window);
    }
  }
}
</script>

<style lang="scss" scoped>

.resources-wrapper {
  margin-top: 30px;

  @include respond-to(handheld) {
    margin-top: 0px;
  }

  ul {
    padding: 15px;
    background-color: white;
    box-shadow: 2px 2px 4px #aaa;

    @include respond-to(handheld) {
      padding: 15px 0px 0px 0px;
      box-shadow: none;
    }

    li {
      list-style-type: circle;
      margin: 0px 0px 8px 15px;
    }
  }

  h3 {
    font-family: "Lato-Bold", sans-serif;
    font-size: 1.1em;
    font-weight: 700;
  }
}
</style>
