<template>

      <div class='data-sections'>

        <ul class='tabs'>
          <tab :class='section.name'
            v-for="section in rendered_tabs" :key="section.name"
            :section="section" :lake="lake"
            :active="currentSectionName === section.name">
          </tab>
        </ul>

        <keep-alive v-if='!tabs_only && show_section'>
          <component :class="currentSection.name"
            class='data-section' :lake='lake' v-bind:is="currentSection">
          </component>
        </keep-alive>
      </div>

</template>

<script>
import { PlantData, MusselData, TextSection } from '@/components/lake/metadata';
import Tab from '@/components/lake/Tab';
import Watershed from '@/components/lake/Watershed';
import Documents from '@/components/lake/Documents';
import Photos from '@/components/lake/Photos';


export default {
  props: ['lake', 'tabs_only'],
  components: {
    TextSection,
    PlantData,
    MusselData,
    Watershed,
    Documents,
    Photos,
    Tab
  },
  data () {
    const sections = [
      TextSection,
      PlantData,
      MusselData,
      Photos,
      Watershed,
      Documents,
    ];
    return {
      all_sections: sections,
      mobile_only_sections: [Watershed, Documents],
      currentSection: sections[0],
      currentSectionName: sections[0].name
    }
  },
  computed: {
    desktop_mode () {
      return window.innerWidth > 600;
    },
    rendered_tabs () {
      if (this.desktop_mode && !this.tabs_only) {
        return this.all_sections.filter(i => !this.mobile_only_sections.includes(i))
      }
      return this.all_sections
    },
    show_section () {
      let tab = !this.mobile_only_sections.includes(this.currentSection);
      if (tab || !this.desktop_mode) {
        return true
      }
    }
  },
  methods: {
    setCurrentSection () {
      let hash = this.$route.hash;
      hash = hash.replace(/#/g,'');
      if (hash) {
        let component = this.all_sections.find(
            i => i.name == hash
        );
        if (!this.mobile_only_sections.includes(component) || !this.desktop_mode) {
          this.currentSection = component;
          this.currentSectionName = component.name
        }
        else {
          this.currentSection = this.all_sections[0];
          this.currentSectionName = this.all_sections[0].name
        }
      }
    }
  },
  created () {
    this.setCurrentSection();
  },
  watch: {
      '$route': function (to) {
        this.setCurrentSection();
    }
  },
}
</script>

<style scoped lang='scss'>





</style>
