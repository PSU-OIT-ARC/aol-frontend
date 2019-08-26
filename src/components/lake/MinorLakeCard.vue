<template>
  <div class="lake-card">
    <div class="photo" :style="photo_style"></div>
    <div class="info">
      <h3>{{ lake.title }}</h3>
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
  name: 'minor-lake-card',
  props: ['lake'],
  computed: {
    photo_style () {
      let photo = require('@/assets/intro-umpqua-lake.png');
      if (this.lake.photo) {
        photo = this.lake.photo;
      }
      return {'background-image': 'url(' + photo + ')'}
    }
  }
}
</script>
