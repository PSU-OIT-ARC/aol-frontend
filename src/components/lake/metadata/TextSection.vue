<template>
  <div v-if="lake.summary && lake.summary.length">
    <p>{{ truncatedText }}</p>
    <div class="full-link-container">
      <router-link :to="lake_href" class='full-page-button'>
        See full details
      </router-link>
    </div>
  </div>
  <div v-else-if="lake.body">
    <p v-html="cleanedHTML()"></p>
  </div>
  <div v-else>
    <p>{{lake.title}} is a {{lake.waterbody_type}}.</p>
  </div>

</template>

<script>
  import app_config from '@/config';

  export default {
    props: ['lake'],
    name: 'text-section',
    title: 'Summary',
    data () {
      return {
        truncatedText: ''
      }
    },
    computed: {
      lake_href () {
        return {name: 'lake',
                params: {reachcode: this.lake.reachcode},
                hash: "#text-section"};
      }
    },
    methods: {
      cleanedHTML () {
        if (this.lake.body !== undefined || this.lake.body != null) {
          return this.lake.body.replace('<p>&nbsp;</p>', '');
        } else {
          return this.lake.body;
        }
      },
      truncateText () {
        if (this.lake.summary === undefined ||
            this.lake.summary == null) {
          console.debug("Lake summary is unavailable, not processing truncation.")
          return
        } else if (this.lake.summary == '') {
          console.debug("Lake has no summary to process.")
          this.truncatedText = ''
          return
        }

        // initialize component reactive text
        console.debug("Initializing truncated text...");
        this.truncatedText = ''

        // match on sentence endings but not abbreviations
        // thanks https://stackoverflow.com/a/34784856
        let re = /\b(\w\.\w\.)|([.?!])\s+(?=[A-Za-z])/g;
        let baseText = this.lake.summary.replace(re, (match, group1, group2) => {
          return group1 ? group1 : group2+"\r";
        }).split('\r');

        // do some magic to dynamically calculate the number of lines
        // based on sidebar-body height.
        let sidebar = document.querySelector('.lake-sidebar-body');
        if (sidebar == null) {
          this.truncatedText = baseText;
        } else if (baseText) {

          // attempt to fill about 2/3 of the compute space, leaving
          // room for multiple rows of tabs.
          let maxFillFactor = 0.666;
          if (app_config.is_tiny(window)) {
            maxFillFactor = 0.5;
          }

          // proportional height of sidebar to fill
          let containerHeight = sidebar.clientHeight * maxFillFactor;
          // proportional width of sidebar
          let containerWidthAdj = sidebar.clientWidth / 420;
          // avg. proportional line length
          let lineLength = 55 * containerWidthAdj;
          // line height of text
          let lineHeight = 20;
          //            link    text-summary padding   internal p padding
          let padding = 40    + 20                   + 30;
          // approximate number of characters this region will fit
          let limit = lineLength * (parseInt(containerHeight - padding) / lineHeight);

          // add lines until the computed character limit is reached
          let nextLine = baseText[0];
          let cnt = 0;

          while (nextLine != undefined && this.truncatedText.length + nextLine.length < limit) {
            this.truncatedText = [this.truncatedText, nextLine].join(' ');
            nextLine = baseText[++cnt];
          }

          // add words from last line until the character limit is reached
          cnt = 0;
          if (nextLine != undefined && this.truncatedText.length + nextLine.length > limit) {
            let parts = nextLine.split(' ');
            let part = parts[0]

            while (part != undefined && this.truncatedText.length + part.length < limit) {
              this.truncatedText = [this.truncatedText, part].join(' ');
              part = parts[++cnt];
            }
            // add an elipsis
            if (this.truncatedText.length) {
              this.truncatedText = [this.truncatedText, '...'].join(' ');
            }
          }
        }

        console.debug("Generated truncated text: " + this.truncatedText);
      }
    },
    watch: {
      lake: function() {
        this.truncateText();
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.truncateText();
      });
    }
  }
</script>

<style scoped lang='scss'>
  .full-link-container {
    padding: 0px;
    margin: 0px;
    margin-bottom: 0.5em;
  }
  .full-page-button,
  .full-page-button:link,
  .full-page-button:visited {
    max-width: 66.666%;
    margin: 0 auto;
    display: block;
    padding: 10px;
    background-color: $primary_color;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    text-align: center;
  }
</style>
