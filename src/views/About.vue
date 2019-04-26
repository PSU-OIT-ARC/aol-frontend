<template>
  <div class="lake-detail-wrapper about-wrapper">

    <div class="blur-image-wrapper">
      <div class="blur-image" :style="{'background-image': 'url(' + require('@/assets/intro-umpqua-lake.png') + ')'}">
      </div>
    </div>

    <div class="lake-detail about-detail">

      <div class="gutter gutter--left">
      </div>

        <div class="content-wrapper">

        <div class="content-header">
          <div class='back'>
            <router-link :to="{ name: 'home', query: back }">
              &larr; Back to Map
            </router-link>
          </div>

          <div class="close-sidebar" @click="close">╳</div>

          <div class="lake-card">
            <div class="photo" :style="{'background-image': 'url(' + require('@/assets/intro-umpqua-lake.png') + ')'}">
            </div>
            <div class="info">
              <h4>A Public Resource Since 1985</h4>
              <h2>About the Atlas of Oregon Lakes</h2>
            </div>

          </div>

        </div>


        <div class="content-body">

          <div class="body-main">

            <p>The Atlas of Oregon Lakes is a resource for the public, resource management agencies, and scientists to enhance management and enjoyment of our lakes. The online atlas is an updated version of the popular <em>Atlas of Oregon Lakes</em> published in 1985.</p>

            <p>The online atlas highlights lake and reservoir water data stored within the <a href="http://deq12.deq.state.or.us/pnwwqx/" target="_blank">Pacific Northwest Water Quality Data Exchange</a> (PNWWQX). The PNWWQX collaborates between a variety of information management projects to facilitate the aggregation of and access to a comprehensive source of data related to water quality in the Pacific Northwest. The PNWWQX was initiated by funds allocated from the EPA Exchange Network Grant program.</p>

            <p>The online Atlas of Oregon Lakes was developed by Portland State University&#39;s <a href="http://www.clr.pdx.edu/" target="_blank">Center for Lakes and Reservoirs</a>, <a href="http://www.pdx.edu/geography/center-for-spatial-analysis-and-research" target="_blank">Center for Spatial Analysis and Research</a>, <a href="http://pdx.edu/usp/" target="_blank">Nohad A. Toulan School of Urban Studies and Planning</a>, and <a href="http://www.pdx.edu/oit/research-computing" target="_blank">Academic and Research Computing</a>. Funding was provided through an EPA Exchange Network Grant administered by Oregon DEQ and through contributions from Portland State University.</p>

            <h3>Organization of the Atlas</h3>

            <p>The online Atlas of Oregon Lakes is organized into two platforms: text and map-based Lakes Pages similar to those included in the print Atlas of Oregon Lakes, and an Interactive Map interface. The interactive map contains links to watershed, lake basin, and water quality plots and statistics as well as links to individual pdfs of 1985 Atlas of Oregon Lakes pages and the new text-based online atlas pages. The text-based online atlas pages contain the same information that is available on the interactive map, but with context to guide users through the information.</p>

            <h3>Contributors</h3>
            <p>The online Atlas of Oregon Lakes was developed by... <a href="/contributors">Read more</a></p>

            <h3>Contact</h3>
            <p>The Center for Lakes and Reservoirs at Portland State University invites viewers... <a href="/contact">Read more</a></p>

          </div>

          <div class="body-sidebar">

              <div class="sidebar__shade">

                <h3>Contact </h3>
                <p>The Center for Lakes and Reservoirs at Portland State University invites viewers of this website to submit information for possible correction of errors in the data reported or interpretations of data on this website. Other information about the conditions in Oregon lakes, such as observing invasive plant or animal life, would be welcomed.</p>

              <p>For further information or to provide feedback, please contact OregonLakesAtlas@pdx.edu.</p>

              <hr />

              <p>If you would like your photos of Oregon lakes featured in the online atlas, click here for submission criteria.</p>

            </div>

          </div>





        </div> <!-- end content-body -->

        <footer>
          <p>
            <a href="http://www.clr.pdx.edu/">Center for Lakes &amp; Reservoirs</a> |
            <a href="http://www.pdx.edu/geography/center-for-spatial-analysis-and-research">Center for Spatial Analysis &amp; Research</a> |
            <a href="http://www.pdx.edu/cupa/">College of Urban &amp; Public Affairs</a> |
            <a href="http://www.pdx.edu/arc/">Academic &amp; Research Computing</a> |
            <a href="http://www.oregon.gov/DEQ/Pages/index.aspx">Oregon Department of Environmental Quality</a>
            <br>© 1985-2019 Atlas of Oregon Lakes. For technical support <a href="/contact">contact us</a>. <a href="/accounts/login/" title="Log in">Log in</a>
          </p>
        </footer>


      </div>

      <div class="gutter gutter--right"></div>

    </div> <!-- end lake-detail -->

  </div>
</template>

<style scoped lang='scss'>
.lake-detail-wrapper {
  display: grid;
  grid-template-rows: 200px 1fr;
  grid-template-columns: 1fr;

  @include respond-to(handheld) {
    grid-template-rows: 150px 1fr;
  }
}

.lake-detail {
  display: grid;
  grid-template-columns: 1fr minmax(900px, 1200px) 1fr;
  background: white;
  @include respond-to(handheld) {
    width: 100vw;
  }
}

.blur-image-wrapper {
  background-color: #838383;
  overflow: hidden;
  position: relative;
}

.blur-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  filter: blur(9px);
  transform: scale(1.1);
}

.close-sidebar {
  position: absolute;
  top: 5px;
  right: 0;
  cursor: pointer;
  font-size: 1em;
  color: white;
  text-align: right;
  @include respond-to(handheld) {
    padding: 0px 15px;
  }
}

.content-wrapper {
  position: relative;
  grid-template-rows: 1fr 80px;


  top: -180px;
  @include respond-to(handheld) {
    top: -140px;
  }
  @include respond-to(handheld) {
    width: 100vw;
  }
}

.content-header {
  @include respond-to(handheld) {
    padding: 0px 15px;
  }
  .back {
    margin: 10px 0;
  }
  .back a {
    color:white;
  }
}

.content-body {
  display: grid;
  grid-template-columns: 2.1fr .9fr;
  margin-top: 40px;

  @include respond-to(handheld) {
    margin-top: 20px;
    grid-template-columns: none;
    grid-template-rows: auto auto;
  }
}

.body-main {
  padding: 0px 15px;

  p {
    margin-top: 10px;
  }
}

.body-sidebar {
  padding: 0px 0px 0px 50px;
  @include respond-to(handheld) {
    padding: 0px 15px;
  }
}

.sidebar__shade {
  padding: 15px;
  background-color: #F3F3F3;
}

h4 {
  font-size: 1em;
  color: #777;
  text-transform: uppercase;
  display: block;
  margin: 0;
  @include respond-to(handheld) {
    font-size: .8em;
    margin-bottom: 10px;
  }
}

h3 {
  font-family: "Lato-Bold", sans-serif;
  font-weight: 700;
  font-size: 1.2em;
  margin-top: 30px;
  margin-bottom: 0px;
  padding-bottom: 0px;
}

h2 {
  font-size: 2em;
  margin-top: 5px;
  @include respond-to(handheld) {
    font-size: 1.1em;
    line-height: 1.3em;
    margin: 0;
  }
}

footer {
  padding: 15px;
  background-color: #F3F3F3;
  margin-top: 40px;
}

</style>
