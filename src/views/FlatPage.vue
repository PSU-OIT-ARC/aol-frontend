<template>
  <div class="page-wrapper">

    <div class="blur-image-wrapper">
      <div class="blur-image" :style="photo_style"></div>
    </div>

    <div class="page-detail">
      <div class="gutter gutter--left"></div>
      <div class="content-wrapper">

        <div class="content-header">
          <div class="lake-card">
            <div class="photo" :style="photo_style"></div>
            <div class="info">
              <h4>A Public Resource Since 1985</h4>
              <h2>{{ page.title }}</h2>
            </div>
          </div>
        </div>

        <div class="content-body">
          <div class="body-main" v-html="page.content"></div>
          <contact-info />
        </div> <!-- end content-body -->
        <aol-footer />
      </div>

    </div>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ContactInfo from '@/components/ContactInfo';
import AolFooter from '@/components/AolFooter';

export default {
  name: 'page',
  props: {
    slug: String,
  },
  components: {
    ContactInfo,
    AolFooter
  },
  computed: {
    ...mapGetters(['getCurrentPage']),
    page () {
      return this.getCurrentPage;
    },
    photo_style () {
      let photo = require('@/assets/intro-umpqua-lake.png');
      return {'backgroundImage': 'url(' + photo + ')'}
    }
  },
  methods: {
    ...mapActions(['fetchPage'])
  },
  created () {
    // fetch the flatpage object
    this.fetchPage(this.slug);
  }
}
</script>

<style scoped lang='scss'>
.page-wrapper {
  display: grid;
  grid-template-rows: 200px 1fr;
  grid-template-columns: 1fr;

  @include respond-to(handheld) {
    grid-template-rows: 150px 1fr;
  }
}

.page-detail {
  display: grid;
  grid-template-columns: 1fr minmax(900px, 1200px) 1fr;
  background: white;
  @include respond-to(handheld) {
    width: 100vw;
  }
}

.blur-image-wrapper {
  background-color: #838383;
  overflow: hidden;
  position: relative;
}

.blur-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  filter: blur(9px);
  transform: scale(1.1);
}

.close-sidebar {
  position: absolute;
  top: 5px;
  right: 0;
  cursor: pointer;
  font-size: 1em;
  color: white;
  text-align: right;
  @include respond-to(handheld) {
    padding: 0px 15px;
  }
}

.content-wrapper {
  position: relative;
  grid-template-rows: 1fr 80px;


  top: -180px;
  @include respond-to(handheld) {
    top: -140px;
  }
  @include respond-to(handheld) {
    width: 100vw;
  }
}

.content-header {
  @include respond-to(handheld) {
    padding: 0px 15px;
  }
  .back {
    margin: 10px 0;
  }
  .back a {
    color:white;
  }
}

.content-body {
  display: grid;
  grid-template-columns: 2.1fr .9fr;
  margin-top: 40px;

  @include respond-to(handheld) {
    margin-top: 20px;
    grid-template-columns: none;
    grid-template-rows: auto auto;
  }
}

.body-main {
  padding: 0px 15px;

  p {
    margin-top: 10px;
  }
}

.body-sidebar {
  padding: 0px 0px 0px 50px;
  @include respond-to(handheld) {
    padding: 0px 15px;
  }
}

h4 {
  font-size: 1em;
  color: #777;
  text-transform: uppercase;
  display: block;
  margin: 0;
  @include respond-to(handheld) {
    font-size: .8em;
    margin-bottom: 10px;
  }
}

h3 {
  font-family: "Lato-Bold", sans-serif;
  font-weight: 700;
  font-size: 1.2em;
  margin-top: 30px;
  margin-bottom: 0px;
  padding-bottom: 0px;
}

h2 {
  font-size: 2em;
  margin-top: 5px;
  @include respond-to(handheld) {
    font-size: 1.1em;
    line-height: 1.3em;
    margin: 0;
  }
}

footer {
  padding: 15px;
  background-color: #F3F3F3;
  margin-top: 40px;
}

</style>
