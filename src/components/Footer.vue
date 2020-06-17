<template>
  <section class="footer-box" :style="{ marginTop: offsetTop + 'px' }">
    <div class="footer-wrapper">
      <div class="footer-content">
        <div class="footer-left">
          <img class="footer-logo" src="../assets/img/logo-2.png" alt="">
          <div class="fa-list">
            <a href="https://www.facebook.com/" target="_blank"><i class="fa fa-facebook" aria-hidden="true"></i></a>
            <a href="https://www.instagram.com/" target="_blank"><i class="fa fa-instagram" aria-hidden="true"></i></a>
            <!--<i class="fa fa-youtube-play" aria-hidden="true"></i>
            <i class="fa fa-twitter" aria-hidden="true"></i>-->
          </div>
        </div>
        <div class="footer-right">
          <dl>
            <dt>Onlive Club</dt>
            <dd><router-link to="/contact">About</router-link></dd>
            <dd><router-link to="/">How it Works</router-link></dd>
            <dd><router-link to="/">Get In Touch</router-link></dd>
            <dd><a to="/signUp" href="javascript:;" @click.prevent="toSignUp">Influencer Signup</a></dd>
          </dl>
          <dl>
            <dt>Legal</dt>
            <dd><router-link to="/">Privacy Policy</router-link></dd>
            <dd><router-link to="/">Terms of Service</router-link></dd>
            <dd><router-link to="/">Influencer Agreement</router-link></dd>
            <dd><router-link to="/">DMCA</router-link></dd>
          </dl>
        </div>
      </div>
      <small class="copyright">©2020 ONLIVE CLUB, All Rights Reserved</small>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Footer",

  props: {
    offsetTop: {
      type: Number,
      default: 0
    }
  },

  computed: {
    ...mapState([ "loginStatus" ])
  },

  methods: {
    toSignUp() {
      if (this.loginStatus !== 2) {
        this.$router.push("/signUp");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/css/common";

.footer-box {
  background-color: #070707;
  /*transition: margin-top 0.25s ease;*/

  .footer-wrapper {
    padding: 0 3%;
  }

  .footer-content {
    display: flex;
    justify-content: space-between;

    .footer-logo {
      margin-bottom: 25px;
      width: 200px;
    }
    .fa-list {
      display: flex;
      i {
        margin-right: 24px;
        color: #757575;
        cursor: pointer;
        &:hover {
          color: #c7c7c7;
        }
      }
    }

    .footer-right {
      display: flex;
      justify-content: space-between;
      dl {
        dt,
        dd a{
          color: #757575;
          font-family: "VegurEL";
          font-weight: bold;
        }
        dt {
          font-size: 20px;
          line-height: 1.6;
        }
        dd a{
          font-size: 18px;
          line-height: 1.6;
          &:hover {
            color: #a6a3a3;
            text-decoration: underline;
          }
        }
      }
    }
  }

  .copyright {
    font-size: 16px;
    color: #757575;
    font-weight: 600;
  }
}



@media screen and (min-width: 1600px) {
  .footer-box {
    padding: 50px 0;
  }
  .footer-content {
    margin-bottom: 65px;
    .footer-right {
      width: 410px;
    }
  }
}
@media screen and (min-width: 1366px) and (max-width: 1599px) {
  .footer-box {
    padding: 45px 0;
    .footer-content {
      margin-bottom: 55px;
      .footer-right {
        width: 390px;
      }
    }
  }
}
@media screen and (min-width: 1080px) and (max-width: 1365px) {
  .footer-box {
    padding: 40px 0;
    .footer-content {
      margin-bottom: 50px;
      .footer-logo {
        margin-bottom: 25px;
        width: 180px;
      }
      .footer-right {
        width: 360px;
      }
    }
    .copyright {
      font-size: 15px;
    }
  }
  .fa {
    font-size: 24px;
    margin-right: 20px;
  }
}
@media screen and (min-width: 751px) and (max-width: 1079px) {
  .footer-box {
    padding: 35px 0;
    .footer-content {
      margin-bottom: 40px;
      .footer-logo {
        margin-bottom: 25px;
        width: 180px;
      }
      .footer-right {
        width: 300px;
        dl {
          dt {
            font-size: 18px;
          }
          dd a {
            font-size: 16px;
          }
        }
      }
    }
    .copyright {
      font-size: 14px;
    }
  }
  .fa {
    font-size: 24px;
    margin-right: 20px;
  }
}
@media screen and (max-width: 750px) {
  .footer-box {
    padding: px2rem(35px) 0;
    .footer-content {
      margin-bottom: px2rem(40px);
      .footer-logo {
        margin-bottom: px2rem(25px);
        width: px2rem(200px);
      }
      .footer-right {
        width: px2rem(320px);
        dl {
          dt {
            font-size: px2rem(24px);
          }
          dd a {
            font-size: px2rem(22px);
          }
        }
      }
    }
    .copyright {
      font-size: px2rem(18px);
    }
  }
  .fa {
    font-size: px2rem(24px);
    margin-right: px2rem(20px);
  }
}
</style>
