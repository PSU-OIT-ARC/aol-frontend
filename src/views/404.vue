<template>
  <div class='not-found-container card-container'>
    <div class='image-background'></div>
    <div class="not-found-card card">
      <div class="gutter"></div>
      <div class="content">
        <img src="~@/assets/offline_lake.png" />
        <div class="copy">
          <h3>Sorry! <span>Error #404</span></h3>
          <h4>The page you're looking for could not be found.</h4>
          <p>
            Try going to the
            <router-link :to="{ name: 'home'}">home page</router-link>
            and searching &rarr;
          </p>
        </div>
      </div>
      <div class="gutter"></div>
    </div>
  </div>
</template>
