<template>
  <div class='data-sections'>
    <div class='tabs'>
      <a
        v-for="section in sections" :href="'#'+section.name.toLowerCase()" :key="section.title"
        v-bind:class="[section.title == currentSectionTitle ? 'active' : '']"
        @click="setCurrentSection(section.title)">
        {{ section.title }}
      </a>
    </div>
    <keep-alive>
      <component
        class='data-section' :lake='lake' v-bind:is="currentSection">
      </component>
    </keep-alive>
  </div>
</template>

<script>
import { PlantData, MusselData, TextSection } from '@/components/lake/metadata';

export default {
  props: ['lake'],
  components: {
    TextSection,
    PlantData,
    MusselData,
  },
  data () {
    return {
      sections: this.$options.components,
      currentSection: Object.keys(this.$options.components)[0],
      currentSectionTitle: Object.values(this.$options.components)[0].title
    }
  },
  methods: {
    setCurrentSection (section_title) {
      let component = Object.entries(this.$options.components).find(
        i => i[1].title == section_title
      )
      this.currentSection = component[0];
      this.currentSectionTitle = component[1].title
    }
  },
  created () {
    // select correct tab based on hash at load time
    let hash = this.$route.hash;
    hash = hash.replace(/#/g,'');
    let component = Object.entries(this.$options.components).find(
      i => i[1].name == hash
    )
    this.currentSection = component[0];
    this.currentSectionTitle = component[1].title
  }
}
</script>

<style scoped lang='scss'>
  .tabs {
    margin-top: 30px;
  }

  a {
    margin-right: 10px;

    &.active {
      font-weight: bold;
    }
  }

  .data-section {
    margin-top: 30px;
  }

</style>
