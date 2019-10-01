<template>
  <footer>
    <p>
      <a href="http://www.clr.pdx.edu/">Center for Lakes &amp; Reservoirs</a> |
      <a href="http://www.pdx.edu/geography/center-for-spatial-analysis-and-research">Center for Spatial Analysis &amp; Research</a> |
      <a href="http://www.pdx.edu/cupa/">College of Urban &amp; Public Affairs</a> |
      <a href="http://www.pdx.edu/arc/">Academic &amp; Research Computing</a> |
      <a href="http://www.oregon.gov/DEQ/Pages/index.aspx">Oregon Department of Environmental Quality</a>
    </p>

    &copy; 1985-{{ new Date().getFullYear() }} Atlas of Oregon Lakes
  </footer>
</template>

<style scoped lang='scss'>
  footer {
    padding: 15px;
    background-color: white;
    margin: 40px 0px 0px 0px;

    @include respond-to(handheld) {

    }
    @include respond-to(medscreen) {
      margin: 40px 15px 0px 15px;
    }
    @include respond-to(lgscreen) {
      margin: 40px 15px 0px 15px;
    }
  }

</style>
