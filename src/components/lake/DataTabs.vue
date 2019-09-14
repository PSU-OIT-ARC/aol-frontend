<template>

      <div class='data-sections'>

        <ul class='tabs'>
          <tab :class='section.name'
            v-for="section in sections" :key="section.name"
            :section="section" :lake="lake"
            :active="currentSectionName === section.name">
          </tab>
        </ul>

        <keep-alive v-if='!tabs_only'>
          <component :class="currentSectionName"
                     :lake='lake'
                     v-bind:is="currentSection"
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
        config.is_mobile(window)
      ],
      currentSection: null,
      currentSectionName: ''
    }
  },
  computed: {
    mobile_mode () {
      return config.is_mobile(window);
    },
    sections () {
      let self = this;
      let sections = this.allSections.filter(function(el, idx) {
        var key = self.detailSectionKeys[idx];
        if (self.tabs_only ) {
          key = self.sidebarSectionKeys[idx];
        }

        if (key === true) {
          return true
        } else if (key == 'has_docs') {
          return config.is_mobile(window) && self.lake[key];
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
    setCurrentSection () {
      let hash = this.$route.hash.replace(/#/g,'');
      let component = this.sections.find(i => i.name == hash);

      if (component != undefined && component != null) {
        this.currentSection = component;
        this.currentSectionname = component.name;
      } else {
        this.currentSection = TextSection;
        this.currentSectionName = TextSection.name;
      }
    }
  },
  created () {
    this.setCurrentSection();
  },
  watch: {
    '$route': function () {
      this.setCurrentSection();
    }
  },
}
</script>

<style scoped lang='scss'>





</style>
