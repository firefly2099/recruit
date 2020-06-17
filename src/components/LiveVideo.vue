<template>
  <section class="no-page">
    <!--<img class="not-found-img" src="../assets/img/404.jpg" alt="">
    <h1>404</h1>
    <h3>This is not the web page you are looking for.</h3>-->
    <h1 style="font-size: 24px;">In development, please look forward to</h1>
  </section>
</template>

<script>
export default {
  name: "LiveVideo"
};
</script>

<style lang="scss" scoped>
@import "../assets/css/common";

.no-page {
  padding: 170px 0;
  text-align: center;

  .not-found-img {
    max-width: 90px;
    margin: 0 auto;
  }

  h1 {
    font-size: 80px;
    line-height: 1.35;
  }
  h3 {
    font-size: 36px;
    line-height: 1.35;
  }
}
</style>
