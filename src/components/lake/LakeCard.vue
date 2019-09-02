<template>
  <div class="lake-card">
    <div class="photo" :style="photo_style"></div>
    <div class="info">
      <h3>{{ lake.title }} <i>({{lake.county_set}})</i></h3>
      <div class="data-icons" v-if="lake.major">
        <div class="icon summary"></div>
        <div v-if="lake.has_mussels" class="icon mussels"></div>
        <div v-if="lake.has_plants" class="icon plants"></div>
        <div v-if="lake.has_documents" class="icon documents"></div>
        <div class="icon watershed"></div>
      </div>
      <p>{{lake.reachcode}}</p>

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
      let photo = require('@/assets/intro-umpqua-lake.png');
      if (this.lake.photo) {
        photo = this.lake.photo;
      } else if (this.lake.photos && this.lake.photos.length) {
        photo = this.lake.photos[0].href;
      }
      return {'backgroundImage': 'url(' + photo + ')'}
    }
  }
}
</script>
