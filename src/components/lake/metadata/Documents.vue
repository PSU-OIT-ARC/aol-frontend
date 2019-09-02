<template>

  <div class="documents-wrapper">
    <a name="documents" id="documents"></a>
    <h3>Documents</h3>

    <ul class="documents-wrapper">
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
export default {
  props: ['lake'],
  name: 'documents',
  title: 'Documents',
}
</script>

<style scoped>

ul.documents-wrapper {
  padding: 15px;
  background-color: white;
  box-shadow: 2px 2px 4px #aaa;

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

</style>
