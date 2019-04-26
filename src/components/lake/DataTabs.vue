<template>
  <div class='data-sections'>

    <ul class='tabs'>
      <tab
        v-for="section in sections" :key="section.name"
        :section="section" :lake="lake"
        :active="currentSectionTitle === section.title">
      </tab>
    </ul>

    <keep-alive v-if='with_sections'>
      <component
        class='data-section' :lake='lake' v-bind:is="currentSection">
      </component>
    </keep-alive>

  </div>
</template>

<script>
import { PlantData, MusselData, TextSection } from '@/components/lake/metadata';
import Tab from '@/components/lake/Tab';

export default {
  props: ['lake', 'with_sections'],
  components: {
    TextSection,
    PlantData,
    MusselData,
    Tab
  },
  data () {
    return {
      sections: this.$options.components,
      currentSection: Object.keys(this.$options.components)[0],
      currentSectionTitle: Object.values(this.$options.components)[0].title
    }
  },
  methods: {
    setCurrentSection () {
      let hash = this.$route.hash;
      hash = hash.replace(/#/g,'');
      if (hash) {
        let component = Object.entries(this.$options.components).find(
          i => i[1].name == hash
        )
        this.currentSection = component[0];
        this.currentSectionTitle = component[1].title
      }
    }
  },
  created () {
    this.setCurrentSection ();
  },
  watch: {
      '$route.hash': function () {
        this.setCurrentSection();
      }
  },
}
</script>

<style scoped lang='scss'>


</style>
