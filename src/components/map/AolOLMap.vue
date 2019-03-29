<template>
  <div class='map-container'>
    <vl-map id="map" class="map" ref="map"
      @click="checkLakeBounds($event.pixel)"
      :load-tiles-while-animating="false"
      :load-tiles-while-interacting="false">

      <vl-view
        :zoom.sync="zoom" :center.sync="center"
        :minZoom="7" :maxZoom="14">
      </vl-view>

      <vl-layer-tile v-for="layer in baseLayers"
        :key="layer.id" :id="layer.id"
        :visible="layer.visible" :extent="layer.extent">
        <vl-source-xyz
          :url="layer.url">
        </vl-source-xyz>
      </vl-layer-tile>

      <vl-layer-vector-tile  v-for="layer in featureLayers"
        :key="layer.id" :id="layer.id" :ref="layer.id"
        :visible="layer.visible" :declutter="true"
        @mounted="applyEsriStyles">
        <vl-source-vector-tile
          :url="layer.url">
        </vl-source-vector-tile>
      </vl-layer-vector-tile>

      <vl-layer-vector id='boundaries' ref="lake_layer">
        <vl-source-vector :features="lake_polygons" >
          <vl-style-box>
            <vl-style-stroke :color="polygon.stroke" :width="polygon.width"/>
            <vl-style-fill :color="polygon.fill"/>
          </vl-style-box>
        </vl-source-vector>
      </vl-layer-vector>

      <vl-layer-vector id='markers' ref="lake_markers" >
        <vl-source-vector :features="lake_markers" ref="lake_marker_source">
          <vl-style-box>
          <vl-style-circle :radius="marker.radius">
            <vl-style-stroke :color="marker.color" :width="polygon.width"/>
            <vl-style-fill :color="marker.fillColor"/>
          </vl-style-circle>
          </vl-style-box>
        </vl-source-vector>
      </vl-layer-vector>

    </vl-map>

          <div class="map-controls-wrapper">

            <div class="map-controls--secondary">

              <layer-switcher
                @feature-layer-change="selectFeatureLayer">
              </layer-switcher>

              <filter-control
                @filter-change="selectLakesFromFilters">
              </filter-control>

            </div>


            <div class="map-buttons--secondary">

              <div class="map-button map-button--layers">
                <svg width="20px" height="22px" viewBox="0 0 20 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <path d="M9.98888889,18.3777778 L1.8,12.0111111 L0,13.4111111 L10,21.1888889 L20,13.4111111 L18.1888889,12 L9.98888889,18.3777778 L9.98888889,18.3777778 Z M10,15.5555556 L18.1777778,9.18888889 L20,7.77777778 L10,0 L0,7.77777778 L1.81111111,9.18888889 L10,15.5555556 L10,15.5555556 Z" id="Shape" fill="#555555"></path>
                  </g>
                </svg>
              </div>

              <div class="map-button map-button--legend">
                <svg width="3px" height="16px" viewBox="0 0 3 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="Group-2" fill="#2B2B2B" fill-rule="nonzero">
                          <rect id="Rectangle-2" x="0" y="6" width="3" height="10"></rect>
                          <circle id="Oval-2" cx="1.5" cy="1.5" r="1.5"></circle>
                      </g>
                  </g>
                </svg>
              </div>





            </div>


          </div>
  </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex';
import {applyStyle} from 'ol-mapbox-style';
import * as proj from 'ol/proj';
import LayerSwitcher from '@/components/map/LayerSwitcher';
import FilterControl from '@/components/map/FilterControl';

export default {
  name: 'aol-ol-map',
  data () {
    return {
      zoom: 8,
      baseLayers: [
        {
          id: "gray",
          visible: true,
          url: "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
          extent: undefined
        },
        {
          id: "nlcd",
          visible: true,
          url: "https://tiles.arcgis.com/tiles/6Miy5NqQWjMYTGFY/arcgis/rest/services/NLCD/MapServer/tile/{z}/{y}/{x}?token=lyAcy1fbdMLMiQ8CRRt9OQqHFmalTF-xMLIz8FX3akLtKMDjC3ONYBN1JsjXcHhFjhNXWkqvn0XsASglYuphIoxwQ3oLyyOifRTHYjOhlxk03YvsMXxAXURvIyN0HOClu2MXAG7dZMeS228JZ-7yi2C-i9skllR54hF_x-HwhKqOmIo2yz05voMpD8U2Tcx4ybfRIzOkGmG-GgGPqmGpEV-GMbPi1H5xeRQV9wu4DuKeAwu5Wv58EGIpmF-dcnSgf-Mj7UjeX4wRvsdqjm3UZEBp0OaL4XlVPmA7GvccQLA",
          extent: [-13847487.234310532, 5367239.26625923, -13539022.354823876, 5532200.785834997],
        }
      ],
      featureLayers: [
        {
          id: 'publand',
          visible: false,
          url: "https://tiles.arcgis.com/tiles/6Miy5NqQWjMYTGFY/arcgis/rest/services/Vector_Publands/VectorTileServer/tile/{z}/{y}/{x}.pbf?token=WlTafmvrujX0RXuKfJg3EP-pTf3RVpG-cy_sRsrA1u1l3807JLmogJVzQMvuS0Gw5F3iqyxZ1nYwG-sg6CSZYfsfCHEVjxs8ghQqHIgaw3Qjv_T93x-O0Y4thLto5iacqfN-TfLWYBlBnwXr60RGjan7-Jm3nhcwAlh69L8DDNJlLJU-_WkbVjUtjlE13O1QOHuTfZVizdmBkUjDTfx4q0xPkzNoJZUcpPr0-vhTH0GznGQH64ytxag82P89G0tfbyaVu7gwkUZSqVA7V9TaPMQSCSR-YrDXqyMwjxAD7zg",
        },
        {
          id: 'nopubland',
          visible: true,
          url: "https://tiles.arcgis.com/tiles/6Miy5NqQWjMYTGFY/arcgis/rest/services/Vector_NoPub/VectorTileServer/tile/{z}/{y}/{x}.pbf?token=WlTafmvrujX0RXuKfJg3EP-pTf3RVpG-cy_sRsrA1u1l3807JLmogJVzQMvuS0Gw5F3iqyxZ1nYwG-sg6CSZYfsfCHEVjxs8ghQqHIgaw3Qjv_T93x-O0Y4thLto5iacqfN-TfLWYBlBnwXr60RGjan7-Jm3nhcwAlh69L8DDNJlLJU-_WkbVjUtjlE13O1QOHuTfZVizdmBkUjDTfx4q0xPkzNoJZUcpPr0-vhTH0GznGQH64ytxag82P89G0tfbyaVu7gwkUZSqVA7V9TaPMQSCSR-YrDXqyMwjxAD7zg",
        }
      ],
      marker: {
        radius: 3,
        color: 'blue',
        fill: true,
        fillColor: 'blue',
        fillOpacity: 1
      },
      polygon: {
        stroke: "yellow",
        fill: "rgba(0,0,0,0.1)",
        width: 1
      },
      selectedAttributes: [],
    }
  },
  components: {
    LayerSwitcher,
    FilterControl
  },
  computed: {
    ...mapGetters(
        {lakes: 'getLakes', getLakeBySlug: 'getLakeBySlug'}, 'getCurrentLake'),
    center: {
      get () {
        return proj.fromLonLat([-121.011856, 43.902925], 'EPSG:3857')
      },
      set (newValue) {
        return newValue;
      }
    },
    // this feature creation is unnecessary if we use GeoJSON
    lake_polygons () {
      return  this.lakes.map((lake) => {
        return {
            type: 'Feature',
            properties: {
              name: lake.slug,
              id: lake.reachcode,
            },
            geometry: {
              type: 'Polygon',
              coordinates: [lake.geom.map((coord) => {
                  return proj.fromLonLat([coord[1], coord[0]], 'EPSG:3857')
              })]
            }
          }
      });
    },
    lake_markers () {
      // maybe move this to vuex or something?
      let hasFilterAttributes = (lake) => {
        if (!this.selectedAttributes.length) {
          return true
        }
        let attr =  this.selectedAttributes.every(
          (attribute) => {
            return lake[attribute] == true
        });
        return attr;
      };

      return this.lakes.filter((lake) => {
        return hasFilterAttributes(lake);
      }).map((lake) => {
        return {
            type: 'Feature',
            properties: {
              name: lake.slug,
              id: lake.reachcode,
            },
            geometry: {
              type: 'Point',
              coordinates: proj.fromLonLat(
                [lake.center[1], lake.center[0]], 'EPSG:3857')
            }
          }
      });
    }
  },
  methods: {
    ...mapActions([
      'fetchLakes', 'setCurrentLake', 'fitBounds',
      'searchLakes', 'setMapObject'
    ]),
    showSideBar (lake) {
      this.$router.push({name: 'home', query: {'lake': lake.slug}})
      this.setCurrentLake(lake);
      this.searchLakes(null); // reset search
      this.fitBounds({geom: lake.geom});
    },
    selectLakeFromUrl () {
      let slug = this.$route.query['lake'];
      if (slug) {
        let lake = this.getLakeBySlug(slug);
        this.setCurrentLake(lake);
        this.fitBounds({geom: lake.geom});
      }
    },
    checkLakeBounds (pixel) {
      console.log(this.map.$map.getCoordinateFromPixel(pixel));
      // see hitTolerance
      this.map.forEachFeatureAtPixel(pixel, (feature, layer) => {
          let lake = this.getLakeBySlug(feature.getProperties().name);
          this.showSideBar(lake);
        },
        {
          layerFilter: (layer_candidate) => {
            return layer_candidate.getProperties().id  != 'publand';
        }
      });
    },
    selectFeatureLayer (selected_layer) {
      let layers = this.map.$map.getLayers().getArray();
      let feature_layers = layers.filter((layer)=>{
        return this.featureLayers.find(l => l.id == layer.getProperties().id);
      });
      feature_layers.map((layer) => {
        if (layer.getProperties()['id'] != selected_layer) {
          layer.setVisible(false);
        }
        else if (layer.getProperties()['id'] == selected_layer) {
          layer.setVisible(true);
        }
      });
    },
    selectLakesFromFilters (filters) {
      this.selectedAttributes = filters;
      // HACK: why isn't this reactive?
      this.$refs.lake_marker_source.refresh();
      this.$refs.lake_marker_source.addFeatures(this.lake_markers)
    },
    applyEsriStyles () {
      let base_style_url = 'https://tiles.arcgis.com/tiles/6Miy5NqQWjMYTGFY/arcgis/rest/services/Vector_Publands/VectorTileServer/resources';

      let sprite_path = 'sprites/sprite';
      let style_path = "styles/root.json";
      let token = 'X_yghsylypn97rtHbkDQs2jSvCCfJFjy9c21yubfP5lsiH_i09SBK0N3sjots2YJAyLgyHqhYp1OVPd1X30Bu0PRVPEapAF37bl88xVHK9Yya8Vw_10h0AGKVpXpdZwpSBLj3A5zu6ZGfoB6vJyE13zSCqOPxVYzBIpSoc9HHQiUNwlhAs0swj6FlB4oh-uMHe-1F2ELK-ifG-V0veMnwhuNPn-YNA5W-uOkbjH7SffbwT_rEq1xTqvcBrwP2cpxJtSIWkPfYgIZnP8tdkngqqt-ueTydQcnSctPfD1lLV8.';

      let style_url = `${base_style_url}/${style_path}?f=json&token=${token}`;
      let sprite_url = `${base_style_url}/${sprite_path}?f=json&token=${token}`;
      fetch(style_url).then((response)=>{
        return response.json()
      }).then((style) => {
        // HACK: zoom seems to be off-by-one?
        style.layers.map((layer) => {
          layer.minzoom -= 0.6;
          layer.maxzoom += 0.6;
        });
        let layers = this.$refs.map.$map.getLayers().getArray();
        let feature_layers = layers.filter((layer)=>{
          return this.featureLayers.find(l => l.id == layer.getProperties().id);
        });
        feature_layers.map((layer) => {
          applyStyle(layer, style, 'esri', sprite_url);
        });
      });
    }
  },
  mounted () {
    this.$refs.map.$createPromise.then(() => {
      this.map = this.$refs.map;
      this.setMapObject(this.map);
      // Fetching LAKES
      if(!this.lakes.length) {
        this.fetchLakes().then(()=> {
          this.selectLakeFromUrl();
        });
      }
      else {
        console.log('I already have the lakes. I will not fetch them again');
        this.selectLakeFromUrl();
      }
    });
  },

}
</script>

<style scoped lang="scss">

</style>
