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
    return {
      allSections: [
        TextSection,
        Watershed,
        Documents,
        PlantData,
        MusselData,
        Photos
      ],
      sidebarSectionKeys: [
        'body',
        true,
        'has_docs',
        'has_plants',
        'has_mussels',
        'has_photos'
      ],
      detailSectionKeys: [
        'body',
        true,
        'documents',
        'plants',
        'mussels',
        'photos'
      ],
      mobile_only: [Watershed, Documents],
      currentSection: TextSection,
      currentSectionName: TextSection.name
    }
  },
  computed: {
    mobile_mode () {
      return window.innerWidth < 600;
    },
    rendered_tabs () {
      var self = this;
      var sections = this.allSections.filter(function(el, idx) {
          var key = self.detailSectionKeys[idx];
          if (self.tabs_only ) {
            key = self.sidebarSectionKeys[idx];
          }

          if (key === true) {
              return true
          } else if (self.lake[key]) {
              if (Array.isArray(self.lake[key])) {
                return self.lake[key].length;
              }
              return true
          }
          return false
      });

      return sections.filter(i => !this.mobile_only.includes(i))
    },
    show_section () {
      let show_for_all = !this.mobile_only.includes(this.currentSection);
      if (show_for_all || this.mobile_mode) {
        return true
      }
      return false
    }
  },
  methods: {
    setCurrentSection () {
      let hash = this.$route.hash;
      hash = hash.replace(/#/g,'');
      if (hash) {
        let component = this.allSections.find(
            i => i.name == hash
        );
        if (!this.mobile_only.includes(component) || this.mobile_mode) {
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
    '$route': function () {
      this.setCurrentSection();
    }
  },
}
</script>

<style scoped lang='scss'>





</style>
