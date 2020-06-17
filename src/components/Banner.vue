<template>
  <section class="banner-wrapper">
    <ul class="banner-list">
      <li>
        <img src="../assets/img/banner.jpg" alt="" width="100%">
        <div class="banner-explain">
          <h3>The Ultimate Influencer Marketing Platform for Original Content, Authentic Voices and Real Relationships</h3>
          <p>Join the Club and get linked to meaningful collaborations with interesting fashion, beauty and lifestyle brands.</p>
          <router-link to="/signUp" class="sign-up" v-if="loginStatus !== 2">JOIN FOR FREE</router-link>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Banner",
  computed: {
    ...mapState(["loginStatus"]),
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/css/common";

.banner-wrapper {
  width: 100%;
  background-color: #fff;
}
.banner-list {
  width: 100%;
  li {
    width: 100%;
    @include pr;
  }
}
.banner-explain {
  @include pa;

  left: 16.6%;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;

  > h3 {

    line-height: 1.22;
    font-family: "VegurB";

  }

  > p {
    width: 75%;

    line-height: 1.5;
    font-family: "VegurR";

    letter-spacing: 0.02em;
  }

  .sign-up {

    text-align: center;
    background-color: #f0143c;
    border-radius: px2rem(6px);
    display: block;
    color: #fff;

    font-family: "VegurB";
    letter-spacing: 0.04em;
    transition: background-color 0.25s;

    &:hover {
      background-color: #f03659;
    }
    &:active {
      transform: translateY(2px);
    }
  }
}

@media screen and (min-width: 1600px) {
  .banner-explain {
    width: 980px;
    > h3 {
      font-size: 50px;
      margin-bottom: 20px;
    }
    > p {
      font-size: 28px;
      margin-bottom: 40px;
    }
    .sign-up {
      width: 400px;
      height: 80px;
      line-height: 80px;
      font-size: 36px;
    }
  }
}
@media screen and (min-width: 1200px) and (max-width: 1599px) {
  .banner-explain {
    width: 60%;
    > h3 {
      font-size: 40px;
      margin-bottom: 15px;
    }
    > p {
      font-size: 24px;
      margin-bottom: 30px;
    }
    .sign-up {
      width: 280px;
      height: 60px;
      line-height: 60px;
      font-size: 28px;
    }

  }
}
@media screen and (min-width: 901px) and (max-width: 1199px) {
  .banner-explain {
    width: 70%;
    > h3 {
      font-size: 36px;
      margin-bottom: 10px;
    }
    > p {
      font-size: 22px;
      margin-bottom: 20px;
    }
    .sign-up {
      width: 240px;
      height: 50px;
      line-height: 50px;
      font-size: 26px;
    }
  }
}
@media screen and (min-width: 751px) and (max-width: 900px) {
  .banner-explain {
    left: 5%;
    width: 85%;
    > h3 {
      font-size: 32px;
      margin-bottom: 8px;
      line-height: 1.1;
    }
    > p {
      font-size: 22px;
      margin-bottom: 15px;
      line-height: 1.2;
    }
    .sign-up {
      width: 220px;
      height: 45px;
      line-height: 45px;
      font-size: 24px;
    }
  }
}
@media screen and (max-width: 750px) {
  .banner-explain {
    left: 5%;
    width: 85%;
    > h3 {
      font-size: px2rem(32px);
      margin-bottom: px2rem(8px);
      line-height: 1.1;
    }
    > p {
      font-size: px2rem(22px);
      margin-bottom: px2rem(15px);
      line-height: 1.2;
    }
    .sign-up {
      width: px2rem(220px);
      height: px2rem(45px);
      line-height: px2rem(45px);
      font-size: px2rem(24px);
    }
  }
}
</style>
