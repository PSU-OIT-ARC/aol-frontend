<template>
  <div class='layer-switcher--container'>
    <h4>Map Base Layers</h4>
    <div class='layer'>
      <div v-for="layer in base_maps" :key='layer.name'>
        <input type='radio'
               :id="layer.name"
               :value='layer.name'
               :checked="getMapBasemap() == layer.name"
               @change="selectBaseMap(layer)"/>
        <label :for='layer.name'>{{ layer.label }}</label>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'layer-switcher',
  data () {
    return {
      base_maps: [
        {
          name: 'topo-vector',
          label: 'Topographic'
        },
        {
          name: 'osm',
          label: 'Streets'
        },
        {
          name: 'gray-vector',
          label: 'Simple'
        },
      ],
      selectedBaseMap: 'topo-vector'
    }
  },
  methods: {
    ...mapActions(['setMapBasemap']),
    ...mapGetters(['getMapBasemap']),
    selectBaseMap (layer) {
      this.setMapBasemap(layer.name);
    },
  }
}
</script>

<style scoped lang='scss'>
  .layer-switcher--container {
    padding: 15px;
    background-color: #fff;

    .layer {
      display: block;
      width: 100%;
    }

    h4 {
      margin: 5px 5px 10px 5px;
    }

    label {
      display: inline-block;
      width: 90%;
      cursor: pointer;
      &:hover {background-color: #eee;}
    }
  }

  div.layer {
    padding: 5px;
    display: inline-block;

    label {
      margin-left: 5px;
      line-height: 2em;
      padding-left: 5px;
      width: 88%;
    }
  }

</style>
