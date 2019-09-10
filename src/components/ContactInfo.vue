<template>
  <div class="body-sidebar">

      <div class="sidebar__shade">
        <h3>Contact </h3>
        <p>
          The Center for Lakes and Reservoirs at Portland State University invites viewers of this website to submit
          information for possible correction of errors in the data reported or interpretations of data on this website.
        </p>
        <p>
          Other information about the conditions in Oregon lakes such as observing invasive plant or animal life is welcomed.
        </p>

      <p>For further information or to provide feedback, please contact <a href="mailto:OregonLakesAtlas@pdx.edu">OregonLakesAtlas@pdx.edu</a>.</p>

      <hr />

      <p>
        If you would like your photos of Oregon lakes featured in the online atlas, please
        review the
        <router-link :to="{name: 'flatpage', params: {slug: 'photo-submissions'}}">submission criteria</router-link>.
      </p>
    </div>

  </div>

</template>

<style>
  .sidebar__shade {
    padding: 15px;
    background-color: #F3F3F3;
  }
  
  h3 {
    font-family: "Lato-Bold", sans-serif;
    font-weight: 700;
    font-size: 1.2em;
    margin-top: 30px;
    margin-bottom: 0px;
    padding-bottom: 0px;
  }

</style>
