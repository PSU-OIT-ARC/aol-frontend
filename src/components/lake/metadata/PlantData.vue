<template>

  <div class="plants-wrapper">
    <a name="plants" id="plants"></a>
    <h3>Plants</h3>

    <table class="table" cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <th>Date</th>
          <th>Species</th>
          <th>Status</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in lake.plants"
            v-bind:item="entry"
            v-bind:index="index"
            v-bind:key="entry.pk">
          <td class="nowrap">{{ entry.observation_date }}</td>
          <td>{{ entry.plant['name'] }} ({{ entry.plant['common_name']}})</td>
          <td>{{ entry.plant['is_native']}}</td>
          <td>{{ entry.source_display }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    props: ['lake'],
    name: 'plants',
    title: 'Plants'
  }
</script>

<style scoped lang='scss'>
</style>
