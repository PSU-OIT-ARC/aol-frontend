<template>
  <div v-if="lake.body.length">
    <p v-if="truncate">
      {{ truncated }}
    </p>
    <p v-else
       v-for="(line, index) in lake.body"
       v-bind:index="index"
       v-bind:key="index">
      {{ line }}
    </p>
    <div class="full-link-container">
      <router-link v-if="truncate" :to="lake_href" class='full-page-button'>
        See full details
      </router-link>
    </div>
  </div>
  <div v-else>
    <p>{{lake.title}} is a {{lake.waterbody_type}}.</p>
  </div>

</template>

<script>
  export default {
    props: ['lake', 'truncate'],
    name: 'text-section',
    title: 'Summary',
    computed: {
      truncated () {
        // match on sentence endings but not abbreviations
        // thanks https://stackoverflow.com/a/34784856
        let paragraph = this.lake.body[0];
        let re = /\b(\w\.\w\.)|([.?!])\s+(?=[A-Za-z])/g;
        let i = 0;
        let sentences = paragraph.replace(re, (match, group1, group2) => {
            return group1 ? group1 : group2+"\r";
        });
        sentences = sentences.split('\r');
        let truncated = sentences.slice(0, 4);
        return truncated.join(' ') + '…';
      },
      lake_href () {
        return {name: 'lake',
                params: {reachcode: this.lake.reachcode},
                hash: "#text-section"};
      }
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
