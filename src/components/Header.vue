<template>
  <!--<section class="header-box" :style="boxStyle" :class="{ 'has-login': userInfo.username }">
    <div class="header-wrapper" :style="wrapperStyle" :class="{ 'has-login': userInfo.username }">-->
  <section class="header-box" :style="boxStyle">
    <div class="header-wrapper" :style="wrapperStyle">
      <div class="header-content">
        <div class="header-left">
          <router-link to="/" class="logo">
            <img src="../assets/img/logo.png" alt="" width="100%">
          </router-link>
          <nav class="nav-list">
            <router-link to="/index">Influencers</router-link>
            <router-link to="/liveVideo">Live Video</router-link>
            <router-link to="/contact">Contact</router-link>
            <template v-if="userInfo.username && winW <= 750">
              <router-link to="/campaigns">Apply for Campaigns</router-link>
              <router-link to="/myCampaigns">My Campaigns</router-link>
              <router-link :to="subProfile">Edit Profile</router-link>
            </template>
          </nav>
        </div>
        <div class="header-right" :style="flexDirection" v-cloak>
          <template v-if="userInfo.username">
            <div class="after-login">Welcome, <a :to="subProfile" @click="toggleHangNav" @mouseenter="showHangNav">{{ userInfo.username }}</a></div>
            <a class="logout" href="#" @click="logout">Log out</a>
            <transition name="slide" :key="1">
              <div class="navigation-hang" v-if="hangNavStatus && winW > 750" @click="hideHangNav">
                <router-link to="/campaigns">Apply for Campaigns</router-link>
                <router-link to="/myCampaigns">My Campaigns</router-link>
                <router-link :to="subProfile">Edit Profile</router-link>
              </div>
            </transition>
          </template>
          <template v-else>
            <a to="/signIn" class="sign-in" v-show="!isSignInPage" @click="goToSignInPage">Sign in</a>
            <router-link to="/signUp" class="sign-up" v-show="!isSignUpPage">JOIN THE CLUB</router-link>
          </template>
        </div>
      </div>

      <!--<div class="navigation-by-login" v-if="userInfo.username && winW > 750">
        <router-link to="/campaigns">Apply for Campaigns</router-link>
        <router-link to="/myCampaigns">My Campaigns</router-link>
        <router-link to="/profile">Edit Profile</router-link>
      </div>-->
    </div>
    <a class="nav-btn" :class="{ open: showNav }" @click="toggleNav">
      <span></span><span></span><span></span>
    </a>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Header",

  data() {
    return {
      showNav: false,
      subProfile: "/profile",
      hangNavStatus: false,
      navTimer: null,
    }
  },

  /*beforeRouteUpdate(to, from, next) {
    console.log("line 42 beforeRouteUpdate", to, from);
    if (from !== "signUp" && to === "signIn") {
      next(false);
    } else {
      next();
    }
  },*/

  props: [ "isSignInPage", "isSignUpPage" ],

  computed: {
    ...mapState(["winW", "winH", "userInfo"]),
    wrapperStyle() {
      // return this.winW <= 900 ? this.userInfo.username ? { "height": this.winH + "px" } : {} : this.winW <= 750 ? { "height": this.winH + "px" } : {};
      return this.winW <= 750 ? { "height": this.winH + "px" } : {};
    },
    boxStyle() {
      return this.showNav ? this.wrapperStyle : {};
    },
    flexDirection() {
      // return this.isSignInPage ? { "justify-content": "flex-end" } : this.isSignUpPage ? { "justify-content": "flex-start" } : {};
      return this.isSignInPage ? { "justify-content": "flex-end" } : {};
    }
  },

  created() {
  },

  mounted() {
    this.$nextTick(() => {
      this.proxyVue.$on("setNavStatus", val => {
        this.showNav = !!val;
        this.$emit("navStatus", this.showNav);
      });

      this.proxyVue.$on("transmit", val => {
        this.subProfile = val;
      });

      document.addEventListener("click", (e) => {
        this.hideHangNav(e, 1);
      }, false);
    });
  },

  methods: {
    toggleHangNav(e) {
      e.stopPropagation();
      this.hangNavStatus = !this.hangNavStatus;
    },

    showHangNav() {
      if (this.winW < 750) { return false; }
      this.hangNavStatus = true;
    },

    hideHangNav(e, from) {
      e.stopPropagation();
      if (from === 1) {
        this.navTimer = setTimeout(() => {
          this.hangNavStatus = false;
        }, 100);
      } else {
        clearTimeout(this.navTimer);
        this.hangNavStatus = false;
      }
    },

    toggleNav() {
      if (this.winW > 900) {
        return false;
      }

      this.showNav = !this.showNav;
      this.$emit("navStatus", this.showNav);
    },

    /**
     * 跳转到登录页面
     */
    goToSignInPage(e) {
      e.preventDefault();

      let fromSignUp = (this.$route.path.match(/^\/signUp/) || this.$route.path.match(/^\/forgotPassword/));
      this.$emit("signInStatus", !fromSignUp);

      if (this.winW <= 750) {
        this.proxyVue.$emit("setNavStatus", false);
      }

      if (fromSignUp) {
        this.$router.push("/signIn");
      }
    },

    /**
     * 退出登录
     */
    logout() {
      this.$store.dispatch("logout")
        .then(res => {
          if (+res.code === 1) {
            if (this.$route.path.match("/profile") || this.$route.path.match("/campaigns")) {
              this.$router.replace("/signIn?url=" + this.$route.path);
            }
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/css/header";
</style>
