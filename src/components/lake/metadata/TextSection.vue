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
    <router-link v-if="truncate" :to="lake_href" class='full-page-button'>
      See full details
    </router-link>
  </div>
  <p v-else>
    {{lake.title}} is a {{lake.waterbody_type}}.
  </p>

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

<style scoped>
  .full-page-button {
    max-width: 300px;
    margin: auto;
    margin-top: 40px;
    display: block;
    padding: 10px;
    background: #06186A;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    text-align: center;
  }
</style>
