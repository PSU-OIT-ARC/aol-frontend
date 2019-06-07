<template>

  <div class="mussels-wrapper">
    <a name="mussels" id="mussels"></a>
    <h3>Molluscs</h3>

    <table class="table" cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <th>Date</th>
          <th>Status/Species</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in lake.mussels"
            v-bind:item="entry"
            v-bind:index="index"
            v-bind:key="entry.pk">
          <td class="nowrap">{{ entry.date_checked }}</td>
          <td>{{ entry.specie['name'] }}</td>
          <td>{{ entry.agency }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    props: ['lake'],
    name: 'mussels',
    title: 'Mussels'
  }
</script>

<style scoped lang='scss'>
</style>
