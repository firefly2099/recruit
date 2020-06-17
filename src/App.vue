<template>
  <div id="app" :class="{ home: isHome, oh: disableScroll }">
    <Header :is-sign-in-page="isSignIn" :is-sign-up-page="isSignUp" @signInStatus="getSignInFromChild" @navStatus="pageScrollStatus"></Header>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <Footer :offset-top="mt"></Footer>
    <div class="float-signin" v-if="signInDialogVisible">
      <div class="dialog-bg" @click="hideSignInDialog"></div>
      <div class="dialog-signin">
        <SignIn :is-dialog="signInDialogVisible"></SignIn>
      </div>
    </div>
    <UploadAvatar v-if="avatarPageStatus"></UploadAvatar>
    <transition name="dialog">
      <MessageDialog v-if="message.msg"></MessageDialog>
    </transition>
    <transition name="dialog">
      <Agreement v-if="agreementId" :id="agreementId"></Agreement>
    </transition>
  </div>
</template>

<script>
import Header from "./components/Header";
import Footer from "./components/Footer";
import SignIn from "./components/SignIn";
import UploadAvatar from "./components/profile/UploadAvatar";
import MessageDialog from "./components/MessageDialog";
import Agreement from "./components/Agreement";

import { mapState, mapActions } from "vuex";

export default {
  timer: null,
  name: 'App',
  components: {
    Header,
    Footer,
    SignIn,
    UploadAvatar,
    MessageDialog,
    Agreement
  },

  data() {
    return {
      isHome: true,
      isSignIn: false,
      isSignUp: false,
      signInDialogVisible: false,
      disableScroll: false,
      mt: 0,
      agreementId: 0
    };
  },

  computed: {
    ...mapState(["avatarPageStatus", "loginStatus", "message"])
  },

  watch: {
    '$route': {
      handler: function(to) {
        if (to.path === "/index" || to.path === "/") {
          this.isHome = true;
        } else {
          this.isHome = false;
        }

        this.isSignIn = to.path === "/signIn" ? true : false;
        this.isSignUp = to.path === "/signUp" ? true : false;
      },
      immediate: true
    }
  },

  beforeCreate() {
    // console.log("beforeCreate");
  },

  created() {
    this.checkLogin()
      .then(res => {
        console.log(res.code);
        if (this.loginStatus === 1) {
          if (this.$route.path.match(/^\/(profile|campaigns|myCampaigns)/)) {
            this.$router.replace("/signIn?url=" + this.$route.fullPath);
          }
        }
      })
      .catch(e => {
        this.$store.commit("setUserInfo", {});
        console.log("checkLogin:", e.message || e);
      });
  },

  mounted() {
    const fun = (val) => setTimeout(() => {
      this.setFooterBottom(val);
      // console.log("App mouted setTimeout:", document.documentElement.clientHeight, document.querySelector("#app").clientHeight, window.getComputedStyle(document.querySelector("#app"), null).height);
    }, 200);

    this.$nextTick(() => {
      fun();
      this.resize();

      this.proxyVue.$on("routeChange", (val) => {
        fun(val);
      });

      this.proxyVue.$on("viewAgreement", val => {
        this.agreementId = val;
      });
    });
  },

  methods: {
    ...mapActions(["checkLogin"]),

    /**
     * 窗口大小变化
     */
    resize() {
      window.addEventListener("resize", () => {
        clearTimeout(this.$options.timer);
        this.$options.timer = setTimeout(this.getPageSize, 350);
      }, false);
    },

    /**
     * 设置Footer在底部显示
     */
    setFooterBottom(val) {
      if (val === 0) {
        this.mt = val;
        return;
      }

      let tempMt = this.mt; // console.info(document.documentElement.clientHeight, document.querySelector("#app").clientHeight, window.getComputedStyle(document.querySelector("#app"), null).height, tempMt);
      let diff = +document.documentElement.clientHeight - (+document.querySelector("#app").clientHeight - tempMt);

      if (diff > 0) {
        tempMt = diff;
      } else if (diff < 0) {
        tempMt = 0;
      }
      this.mt = tempMt < 0 ? 0 : tempMt;
    },

    /**
     * 获取页面大小
     */
    getPageSize() {
      console.log("getPageSize...");
      let w = window.innerWidth,
        h = window.innerHeight;
      this.$store.commit("setPageWidth", {
        w,
        h
      });

      this.setFooterBottom();
    },

    /**
     * 登录弹窗显示状态
     */
    getSignInFromChild(flag) {
      this.signInDialogVisible = flag;
    },

    /**
     * 隐藏登录弹窗
     */
    hideSignInDialog() {
      this.signInDialogVisible = false;
    },

    /**
     * 启用或禁用页面滚动
     * @param val boolean
     */
    pageScrollStatus(val) {
      this.disableScroll = val;
    }
  }
}
</script>

<style lang="scss">
@import "assets/css/common";

@font-face {
  font-family: "VegurB";
  src: url("./assets/css/fonts/Vegur-B_0500.eot");
  src: url("./assets/css/fonts/Vegur-B_0500.woff2") format("woff2"),
    url("./assets/css/fonts/Vegur-B_0500.woff") format("woff"),
    url("./assets/css/fonts/Vegur-B_0500.ttf") format("truetype"),
    url("./assets/css/fonts/Vegur-B_0500.svg#BoinkLetPlain") format("svg");
}
@font-face {
  font-family: "VegurEL";
  src: url("./assets/css/fonts/Vegur-EL_0500.eot");
  src: url("./assets/css/fonts/Vegur-EL_0500.woff2") format("woff2"),
    url("./assets/css/fonts/Vegur-EL_0500.woff") format("woff"),
    url("./assets/css/fonts/Vegur-EL_0500.ttf") format("truetype"),
    url("./assets/css/fonts/Vegur-EL_0500.svg#BoinkLetPlain") format("svg");
}
@font-face {
  font-family: "VegurR";
  src: url("./assets/css/fonts/Vegur-R_0500.eot");
  src: url("./assets/css/fonts/Vegur-R_0500.woff2") format("woff2"),
    url("./assets/css/fonts/Vegur-R_0500.woff") format("woff"),
    url("./assets/css/fonts/Vegur-R_0500.ttf") format("truetype"),
    url("./assets/css/fonts/Vegur-R_0500.svg#BoinkLetPlain") format("svg");
}
@font-face {
  font-family: "FontAwesome";
  src: url(./assets/css/fonts/fontawesome-webfont.eot?v=4.7.0);
  src: url(./assets/css/fonts/fontawesome-webfont.eot?#iefix&v=4.7.0) format('embedded-opentype'),url(./assets/css/fonts/fontawesome-webfont.woff2?v=4.7.0) format('woff2'),url(./assets/css/fonts/fontawesome-webfont.woff?v=4.7.0) format('woff'),url(./assets/css/fonts/fontawesome-webfont.ttf?v=4.7.0) format('truetype'),url(./assets/css/fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular) format('svg');
  font-weight: 400;
  font-style: normal
}

#app {
  font-family: VegurB,Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /*min-height: calc(100% - 1px);*/
  box-sizing: border-box;
  background-color: #f0f0f0;

  &.home {
    background: none;
    /*box-sizing: border-box;
    background: url("./assets/img/map.jpg") center no-repeat;
    background-size: $bg100;
    background-attachment: fixed;*/
    &:before {
      content: "";
      position: fixed;
      z-index: -1;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      background: url("./assets/img/map.jpg") center no-repeat;
      background-size: $bg100;
    }
  }

  &.oh {
    height: 100%;
    overflow: hidden;
  }
}

.float-signin {
  @include pf;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;

  .dialog-bg {
    @include full;
    background-color: rgba(0, 0, 0, 0.2);
  }

  .dialog-signin {
    @include pa;
    width: 500px;
    height: 450px;
    right: 55px;
    box-sizing: border-box;
  }
}

.fa {
  /*width: 32px;*/
  display: inline-block;
  text-align: right;
  font: normal normal normal 14px/1 FontAwesome;
  font-size: 28px;
}
.fa-facebook:before {
  content: "\f09a";
}
.fa-youtube-play:before {
  content: "\f16a";
}
.fa-linkedin:before {
  content: "\f0e1";
}
.fa-instagram:before {
  content: "\f16d";
}
.fa-twitter:before {
  content: "\f099";
}
.fa-search-minus:before {
  content: "\f010";
}
.fa-search-plus:before {
  content: "\f00e";
}
.fa-check-circle:before {
  content: "\f058";
}
.fa-info-circle:before {
  content: "\f05a";
}
.fa-warning:before, .fa-exclamation-triangle:before {
  content: "\f071";
}
.fa-trash-o:before {
  content: "\f014";
}

::-webkit-input-placeholder {
  font-style: italic;
  color: #b9b9b9;
  font-weight: normal;
  font-family: VegurEL;
}
input:focus::-webkit-input-placeholder {
  color: #d9d9d9;
}

@media screen and (min-width: 1600px) {
  #app {
    padding-top: 78px;
    /*padding-top: calc(98px + 74px);*/
  }
  .float-signin {
    .dialog-signin {
      top: 88px;
    }
  }
}
@media screen and (max-width: 1599px) and (min-width: 751px) {
  #app {
    padding-top: 68px;
  }
  .float-signin {
    .dialog-signin {
      top: 68px;
    }
  }
}
/*@media screen and (max-width: 900px) and (min-width: 751px) {

}*/
@media screen and (max-width: 750px) {
  #app {
    padding-top: 40px;
  }
  .float-signin {
    .dialog-bg {
      background-color: rgba(0, 0, 0, 0.5);
    }
    .dialog-signin {
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      width: 100%;
      margin: auto auto;
    }
  }
}

.waiting-for-login {
  padding: 100px 0;
}

.fade-enter-active {
  transition: all 0.3s ease 0.2s;
}
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter, .fade-leave-to
  /* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
}
.fade-leave-active {
  position: absolute;
  /*width: 100%;*/
  left: 0;
  right: 0;
  box-sizing: border-box;
}

.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.35s ease !important;
  .dialog-bg,
  .dialog-box {
    transition: all 0.35s ease !important;
  }
}

/*.slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}*/
.dialog-enter, .dialog-leave-to {
  margin-bottom: 1px !important;
  .dialog-bg {
    opacity: 0 !important;
  }
  .dialog-box {
    transform: translateY(-10px) !important;
    opacity: 0 !important;
  }
}

[v-cloak] {
  display: none;
}
</style>
