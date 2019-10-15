<template>
  <div class="lake-card">
    <div v-bind:class="[!lake.photo ? 'photo--generic' : '', 'photo']"
         v-bind:style="photo_style">
    </div>
    <div class="info">
      <h3>{{ lake.title }}</h3>
      <div class="data-icons" v-if="lake.is_major">
        <div class="icon summary"></div>
        <div v-if="lake.has_mussels" class="icon mussels"></div>
        <div v-if="lake.has_plants" class="icon plants"></div>
        <div v-if="lake.has_documents" class="icon documents"></div>
        <div class="icon watershed"></div>
      </div>
      <span class="reachcode">{{lake.reachcode}}</span>
      <div class="metadata">
        <em v-for="(county, index) in lake.counties"
            v-bind:item="county"
            v-bind:index="index"
            v-bind:key="county">
            {{ county }} <span v-if="index < lake.counties.length-1">/</span>
        </em>
      </div>
      <div class="fast-stats">
        <table cellpadding="0" cellspacing="0">
          <thead>
            <tr>
              <th class="longrow">Area</th>
              <th>Shoreline</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="longrow">{{lake.area}} acres</td>
              <td>{{lake.shoreline}} mi</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<script>

export default {
  name: 'lake-card',
  props: ['lake'],
  computed: {
    photo_style () {
      let photo = require('@/assets/icon_generic_lake.png');
      if (this.lake.photo) {
        photo = this.lake.photo;
      }
      return {'backgroundImage': 'url(' + photo + ')'}
    }
  }
}
</script>
