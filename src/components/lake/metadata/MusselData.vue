<template>

  <div class="mussels-wrapper">
    <a name="mussels" id="mussels"></a>
    <h3>Molluscs</h3>

    <table class="table" cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <th>Date</th>
          <th>Target</th>
          <th>Collection Method</th>
          <th>Data Provider</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in lake.mussels"
            v-bind:item="entry"
            v-bind:index="index"
            v-bind:key="entry.pk">
          <td class="nowrap">{{ entry.date_sampled }}</td>
          <td>{{ entry.target }}</td>
          <td>{{ entry.collection_method }}</td>
          <td>
            <span v-for="(line, index) in entry.data_provider"
                  v-bind:index="index"
                  v-bind:key="index">
              {{ line }}<br />
            </span>
          </td>
          <td>{{ entry.status_display }}</td>
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
