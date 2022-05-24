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
import { markRaw } from 'vue';

import Tab from '@/components/lake/Tab';
import {TextSection,
        Watershed,
        PlantData,
        MusselData,
        Photos,
        Documents,
        Resources} from '@/components/lake/metadata';

import config from '@/config';

export default {
  props: ['lake', 'tabs_only'],
  components: {
    TextSection,
    Watershed,
    PlantData,
    MusselData,
    Photos,
    Documents,
    Resources,
    Tab
  },
  data () {
    return {
      currentSection: null,
      currentSectionName: ''
    }
  },
  computed: {
    sections () {
      let allSections = [
        TextSection,
        Watershed,
        PlantData,
        MusselData,
        Photos,
        Documents,
        Resources
      ];
      let sidebarSectionKeys = [
        'summary',
        false,
        'has_plants',
        'has_mussels',
        'has_photos',
        'has_docs',
        'has_resources'
      ];
      let detailSectionKeys = [
        'body',
        false,  // temporarily disabled pending review
        'plants',
        'mussels',
        'photos',
        'documents',
        'resources'
      ];

      let self = this;
      let sections = allSections.filter(function(el, idx) {
        var key = detailSectionKeys[idx];
        if (self.tabs_only ) {
          key = sidebarSectionKeys[idx];
        }

        if (key === true) {
          return true
        } else if (key == 'has_docs' || key == 'documents' ||
                   key == 'has_resources' || key == 'resources') {
          return config.is_mobile(window) &&
                 (self.lake[key] == true || self.lake[key].length);
        } else if (self.lake[key]) {
          if (key != 'body' && key != 'summary' && Array.isArray(self.lake[key])) {
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
        this.currentSection = markRaw(component);
        this.currentSectionName = component.name;
      } else {
        this.currentSection = markRaw(TextSection);
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
