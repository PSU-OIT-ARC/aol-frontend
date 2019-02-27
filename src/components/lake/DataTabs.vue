<template>
  <div class='data-sections'>
    <div class='tabs'>
      <a
        v-for="section in sections" :href="'#'+section.name.toLowerCase()" :key="section.title"
        v-bind:class="[section.title == currentSectionTitle ? 'active' : '', section.name]"
        @click="setCurrentSection(section.title)">
        <span>{{ section.title }}</span>
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
    if (hash) {
      let component = Object.entries(this.$options.components).find(
        i => i[1].name == hash
      )
      this.currentSection = component[0];
      this.currentSectionTitle = component[1].title
    }
  }
}
</script>

<style scoped lang='scss'>
  .tabs {
    margin-top: 80px;
  }

  a {
    margin-right: 30px;
    padding-left: 3px;
    position: relative;

    &.active {
      font-weight: bold;
    }

    &.plants::before {
      content: '\01F33F';
    }

    &.mussels::before {
      content: '\1F41A';
    }

    &.atlas_text {
      margin-right: 18px;
    }

    &.atlas_text::before {
      content: '\1F4D6';
      padding: 10px 45px;
    }

  }

  a.active::before {
    border-top: 5px solid green;
    padding-bottom: 10px;
    top: -71px;
  }

  a::before {
    font-size: 50px;
    position: absolute;
    top: -68px;
    left: -5px;
    border: 1px solid grey;
    padding: 10px;
  }

  .data-section {
    margin-top: 30px;
  }

</style>
