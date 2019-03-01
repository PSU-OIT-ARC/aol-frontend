<template>
  <div class='tab'>
    <router-link
      v-bind:class="[active ? 'active' : '', section.name]"
      :to="{
        name: 'lake',
        params: {'slug': lake.slug},
        hash: `#${section.name}`
      }">
      <span class="tab-title">{{ section.title }}</span>
    </router-link>
  </div>
</template>

<script>
export default {
  props: ['section', 'active', 'lake'],
}
</script>

<style scoped lang='scss'>

  .tab {
    display: inline-block;
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

  a::before {
    font-size: 50px;
    position: absolute;
    top: -68px;
    left: -5px;
    border: 1px solid grey;
    padding: 10px;
  }

  /* only use 'active tab' styles on lakes detail page */
  .lake-detail--body a.active {
    font-weight: bold;
  }

  .lake-detail--body a.active::before {
      border-top: 5px solid green;
      padding-bottom: 10px;
      top: -71px;
  }

</style>
