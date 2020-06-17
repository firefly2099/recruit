<template>
  <div class="profile-wrapper">
    <ProfileNav :complete="perfect"></ProfileNav>
    <router-view v-if="!$route.meta.keepAlive" :system-tips="tips" ref="subPage" :info="info.profile" :rates="info.rates" :address="info.address" :payment="info.payment" :social="info.social"></router-view>
    <keep-alive exclude="changePassword">
      <router-view v-if="!!$route.meta.keepAlive" :system-tips="tips" ref="subPage" :info="info.profile" :rates="info.rates" :address="info.address" :payment="info.payment" :social="info.social"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import ProfileNav from "./ProfileNav";

import { mapState } from "vuex";

export default {
  name: "Profile",

  data() {
    return {
      tips: "loading",
      info: {
        profile: {},
        rates: {},
        address: {},
        payment: {},
        social: {}
      },
      perfect: 0,
      timer: null,

    };
  },

  components: {
    ProfileNav
  },

  beforeRouteUpdate(to, from, next) {
    clearTimeout(this.timer);
    let { path } = to;

    if (this.loginStatus === 1) {
      next({ path: "/signIn", query: { url: path } });
    } else {
      console.info("profile", to.path, from);
      // this.init(to);
      if (path === ("/profile/info")) {
        this.getBasicInformation();
      } else if (path === ("/profile/rates")) {
        this.getRates();
      } else if (path === ("/profile/address")) {
        this.getAddress();
      } else if (path === ("/profile/payment")) {
        this.getPayment();
      } else if (to.path.match("/social")) {
        this.getSocial();
      }

      // Trigger Header.vue handler transmit
      this.proxyVue.$emit("transmit", to);
      next();
    }
  },

  computed: {
    ...mapState(["basicInformation", "rates", "address", "payment", "userInfo", "loginStatus"])
  },

  created() {
    clearTimeout(this.timer);
    let to = this.$route;

    if (this.loginStatus === 0) {
      let loginTimer = setInterval(() => {
        if (this.loginStatus !== 0) {
          clearInterval(loginTimer);
          this.loginIntercept(to, this.loginStatus);
        }
      }, 17);
    } else {
      this.loginIntercept(to, this.loginStatus);
    }

    // 获取资料完整度
    this.getPerfectInfo();
  },

  mounted() {
    /*window.addEventListener("popstate", (event) => {
      console.log("profile event:", event, "\n", event.target.location.href, document.referrer);
      if (event.target.location.href.indexOf("/payment") !== -1) {
        this.getPayment();
        return false;
      }
    }, false);*/
  },

  methods: {
    /**
     * 接口拦截(检测是否登录)
     */
    loginIntercept(to, loginStatus) {
      if (loginStatus === 2) { // 登录
        this.init(to);
      }
    },

    init(to) {
      if (to.path.match("/info")) {
        // Object.keys(this.basicInformation).length === 0 && this.getBasicInformation();
        this.getBasicInformation();
      } else if (to.path.match("/rates")) {
        this.getRates();
      } else if (to.path.match("/address")) {
        this.getAddress();
      } else if (to.path.match("/payment")) {
        this.getPayment();
      } else if (to.path.match("/social")) {
        this.getSocial();
      }
    },

    /**
     * 日期格式转换
     */
    formatDate(date) {
      let str = date.split("-");
      return str[1] + "/" + str[2] + "/" + str[0];
    },

    /**
     * 获取用户基本信息
     */
    getBasicInformation() {
      this.$store.dispatch("queryProfile")
        .then(res => {
          if (+res.code === 1000) {
            return this.redirectSignIn();
          }

          if (+res.code !== 1) {
            this.tips = res.info;
          } else {
            let infoTags = ["full_name", "social_name", "gender", "birth", "phone", "lang", "occupation", "race", "height", "bust", "hips", "waist", "bio", "tag_id"];
            let flag = false;
            for (let attr of infoTags) {
              if (res.data[attr] != null) {
                flag = true;
                break;
              }
            }

            if (res.data["url"].length > 1) {
              flag = true;
            }

            this.tips = "";
            this.info.profile = !res.data ? {} : res.data;
            this.info.profile.birth = this.basicInformation.birth ? this.formatDate(this.basicInformation.birth) : "";

            if (!flag) {
              this.$route.path === "/profile/info" && this.$router.replace("/profile/info/edit");
            }

            // this.$refs.subPage.copyInformation();
          }
          this.clearTips();
        })
        .catch(e => {
          this.tips = e.message || e;
          this.clearTips();
        });
    },

    /**
     * 获取价格
     */
    getRates() {
      this.$store.dispatch("queryRates")
        .then(res => {
          if (+res.code === 1000) {
            return this.redirectSignIn();
          }

          if (+res.code !== 1) {
            this.tips = res.info;
          } else {
            if (!res.data) {
              this.$route.path === "/profile/rates" && this.$router.replace("/profile/rates/edit");
            } else {
              this.tips = "";
              this.info.rates = !res.data ? {} : res.data;
              // this.$refs.subPage.copyInformation();
            }
          }
          this.clearTips();
        })
        .catch(e => {
          this.tips = e.message || e;
          this.clearTips();
        });
    },

    /**
     * 获取地址
     */
    getAddress() {
      this.$store.dispatch("queryAddress")
        .then(res => {
          if (+res.code === 1000) {
            return this.redirectSignIn();
          }

          if (+res.code !== 1) {
            this.tips = res.info;
          } else {
            if (!res.data) {
              this.$route.path === "/profile/address" && this.$router.replace("/profile/address/edit");
            } else {
              this.tips = "";
              this.info.address = !res.data ? {} : res.data;
              // this.$refs.subPage.copyInformation();
            }
          }
          this.clearTips();
          this.proxyVue.$emit("routeChange", 1);
        })
        .catch(e => {
          this.tips = e.message || e;
          this.clearTips();
        });
    },

    /**
     * 获取支付信息
     */
    getPayment() {
      this.$store.dispatch("queryPayment")
        .then(res => {
          if (+res.code === 1000) {
            return this.redirectSignIn();
          }

          if (+res.code !== 1) {
            this.tips = res.info;
          } else {
            this.tips = "";
            this.info.payment = !res.data ? {} : res.data;
            // this.$refs.subPage.copyInformation();
          }
          this.clearTips();
        })
        .catch(e => {
          this.tips = e.message || e;
          this.clearTips();
        });
    },

    /**
     * 获取社交账号
     */
    getSocial() {
      this.$store.dispatch("querySocial")
        .then(res => {
          if (+res.code === 1000) {
            return this.redirectSignIn();
          }

          if (+res.code !== 1) {
            this.tips = res.info;
          } else {
            if (!res.data) {
              this.$route.path === "/profile/social" && this.$router.replace("/profile/social/edit");
            } else {
              this.tips = "";
              this.info.social = !res.data ? {} : res.data;
              // this.$refs.subPage.copyInformation();
            }
          }
          this.clearTips();
        })
        .catch(e => {
          this.tips = e.message || e;
          this.clearTips();
        });
    },

    /**
     * 清空提示内容
     */
    clearTips() {
      this.timer = setTimeout(() => {
        this.tips = "";
      }, 2000);
    },

    /**
     * 获取资料完整度
     */
    getPerfectInfo() {
      this.$store.dispatch("queryPerfect")
        .then(res => {
          if (+res.code === 1) {
            this.perfect = res.data.percent;
          }
        })
        .catch(e => {
          console.log(e.message || e);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";

.profile-wrapper {
  background-color: #f0f0f0;
  display: flex;
  box-sizing: border-box;
}


@media screen and (min-width: 1600px) {
  .profile-wrapper {
    padding: 30px;
  }
}

@media screen and (min-width: 1366px) and (max-width: 1599px) {
  .profile-wrapper {
    padding: 25px;
  }
}

@media screen and (min-width: 1080px) and (max-width: 1365px) {
  .profile-wrapper {
    padding: 20px;
  }
}

@media screen and (min-width: 900px) and (max-width: 1079px) {
  .profile-wrapper {
    padding: 15px;
  }
}

@media screen and (min-width: 751px) and (max-width: 899px) {
  .profile-wrapper {
    padding: 15px;
  }
}

@media screen and (min-width: 641px) and (max-width: 750px) {
  .profile-wrapper {
    padding: 12px;
  }
}

@media screen and (max-width: 640px) {
  .profile-wrapper {
    padding: 0px;
    @include pr;
    z-index: 1;
  }
}

@media screen and (min-width: 1600px) {
  .profile-nav-box {
    width: 400px;
  }
  .profile-edit-wrapper {
    width: calc(100% - 400px);
  }
}
@media screen and (min-width: 751px) and (max-width: 1599px) {
  .profile-edit-wrapper {
    width: 75%;
  }
}

@media screen and (min-width: 641px) and (max-width: 750px) {
  .profile-edit-wrapper {
    width: 70%;
  }
}

@media screen and (max-width: 640px) {
  .profile-edit-wrapper {
    width: 100%;
  }
}
</style>

<style lang="scss">
@import "../../assets/css/common";

.system-tips {
  color: #f0143c;
  font-size: 18px;
  line-height: 2;
  text-align: center;
}

.profile-edit-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-info {
  font-size: 20px;
  line-height: 34px;
  color: #f0143c;
  /*text-indent: 1em;*/
  img {
    max-width: 300px;
  }

  em {
    color: #757575;
  }
}

.unit {
  color: #f0143c !important;
  font-size: 16px !important;
}

.profile-border {
  height: 30px;
  border-bottom: 1px solid #b2b2b2;
  padding-left: 10px;
  box-sizing: border-box;
  .small {
    font-size: 16px;
    font-style: italic;
    font-weight: normal;
  }
}
.profile-address {
  height: auto;
  line-height: 1.2;
  padding: 2px 10px;
}

@media screen and (min-width: 1366px) and (max-width: 1599px) {
  .profile-info {
    font-size: 18px;
  }
}

@media screen and (min-width: 1080px) and (max-width: 1365px) {
  .profile-info {
    font-size: 18px;
  }
}

@media screen and (min-width: 900px) and (max-width: 1079px) {
  .profile-info {
    font-size: 18px;
  }
}

@media screen and (min-width: 751px) and (max-width: 899px) {
  .profile-info {
    font-size: 18px;
  }
}

@media screen and (min-width: 641px) and (max-width: 750px) {
  .profile-info {
    font-size: 16px;
  }
}

@media screen and (max-width: 640px) {
  .profile-info {
    font-size: 16px;
  }
}
</style>
