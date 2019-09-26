<template>

      <div class='data-sections'>

        <ul class='tabs'>
          <tab v-for="section in sections" :key="section.name"
               :section="section"
               :lake="lake"
               :active="isCurrentSection(section.name)">
          </tab>
        </ul>

        <keep-alive v-if='!tabs_only'>
          <component v-bind:is="currentSection"
                     :lake='lake'
                     :class="currentSectionName"
                     class='data-section'>
          </component>
        </keep-alive>
      </div>

</template>

<script>
import Tab from '@/components/lake/Tab';
import {TextSection,
        Watershed,
        PlantData,
        MusselData,
        Photos,
        Documents} from '@/components/lake/metadata';

import config from '@/config';

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
    return {
      allSections: [
        TextSection,
        Watershed,
        PlantData,
        MusselData,
        Photos,
        Documents
      ],
      sidebarSectionKeys: [
        'body',
        false,
        'has_plants',
        'has_mussels',
        'has_photos',
        'has_docs'
      ],
      detailSectionKeys: [
        'body',
        false,  // temporarily disabled pending review
        'plants',
        'mussels',
        'photos',
        'documents',
      ],
      currentSection: null,
      currentSectionName: ''
    }
  },
  computed: {
    sections () {
      let self = this;
      let sections = this.allSections.filter(function(el, idx) {
        var key = self.detailSectionKeys[idx];
        if (self.tabs_only ) {
          key = self.sidebarSectionKeys[idx];
        }

        if (key === true) {
          return true
        } else if (key == 'has_docs' || key == 'documents') {
          return config.is_mobile(window) &&
                 (self.lake[key] == true || self.lake[key].length);
        } else if (self.lake[key]) {
          if (key != 'body' && Array.isArray(self.lake[key])) {
            return self.lake[key].length;
          }
          return true
        }
        return false
      });

      return sections.filter(() => {
        if (!this.lake.is_major) {
           return false;
        }

        return true;
      });
    },
  },
  methods: {
    isCurrentSection(name) {
      return this.currentSectionName == name;
    },
    initSection () {
      let hash = this.$route.hash.replace(/#/g,'');
      let component = this.sections.find(i => i.name == hash);

      if (component != undefined && component != null) {
        this.currentSection = component;
        this.currentSectionName = component.name;
      } else {
        this.currentSection = TextSection;
        this.currentSectionName = TextSection.name;
      }
    }
  },
  created () {
    this.initSection();
  },
  watch: {
    '$route': function () {
      this.initSection();
    }
  },
}
</script>

<style scoped lang='scss'>





</style>
