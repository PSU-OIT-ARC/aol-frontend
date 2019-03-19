<template>
  <div class='tab'>
    <router-link
      v-bind:class="[active ? 'active' : '', section.name, 'tab-icon']"
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
  }

  a:link, a:visited {
    font-family: "Lato-Regular", sans-serif;
    background-color: #ECECEC;
    padding: 10px 20px 10px 50px;
    display: block;
    text-decoration: none;
    color: #000;

    &:hover, &:focus {
      background-color: #D8D8D8;
    }

    &.active {
      font-family: "Lato-Bold", sans-serif;
      font-weight: 700;
    }
  }

  .plants {
    background-image: url(~@/assets/icon_search.svg);
  }

  .mussels {
    background-image: url(~@/assets/icon_search.svg);
  }

  .atlas_text {
    background-image: url(~@/assets/icon_search.svg);
  }

  .tab-icon {
    background-repeat: no-repeat;
    background-position: 20px center;
    background-size: 13% auto;
  }


  /* only use 'active tab' styles on lakes detail page */
  .lake-detail--body a.active {
    font-weight: bold;
  }

  .lake-detail--body a.active {
      border-top: 5px solid red;
      padding-bottom: 10px;
  }

</style>
