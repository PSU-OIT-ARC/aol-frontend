<template>

  <div v-if="!mobile_mode" class="documents-wrapper">
    <a name="documents" id="documents"></a>
    <h3>Documents</h3>
    <ul>
      <li v-for="(doc, index) in lake.documents"
          v-bind:item="doc"
          v-bind:index="index"
          v-bind:key="doc.file">
        <a :href="doc.file" target="_">{{ doc.name }}</a>
      </li>
    </ul>
  </div>
  <div v-else class="documents-wrapper">
    <h3>Documents</h3>
    <ul>
      <li v-for="(doc, index) in lake.documents"
          v-bind:item="doc"
          v-bind:index="index"
          v-bind:key="doc.file">
        <a :href="doc.file" target="_">{{ doc.name }}</a>
      </li>
    </ul>
  </div>

</template>

<script>
import config from '@/config';

export default {
  props: ['lake'],
  name: 'documents',
  title: 'Documents',
  computed: {
    mobile_mode () {
      return config.is_mobile(window);
    }
  }
}
</script>

<style lang="scss" scoped>

.documents-wrapper {
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
