<template>
  <section class="profile-nav-box" :class="{ full: navStatus }" @click="hideNav">
    <div class="profile-nav-main">
      <div class="profile-nav-top">
        <div class="avatar-wrapper">
          <img class="profile-avatar" :src="avatar" alt="">
          <a class="add-avatar-btn" v-if="!userInfo.headimg">
            <img src="../../assets/img/icon-add-avatar.png" alt="" width="100%">
          </a>
          <input type="file" class="avatar-file" @change="chooseAvatar" ref="avatarFile" title="">
          <div class="profile-nav-toggle" :class="{ hide: navStatus }" @click="showNav"></div>
        </div>
        <div class="profile-nickname">
          <strong>{{ userInfo.username }}</strong>
          <div class="profile-msg">
            <div class="profile-msg-count">
              <img src="../../assets/img/icon-msg.png" alt="">
              <span>0</span>
            </div>
            <div class="profile-complete">{{ complete }}% complete</div>
          </div>
        </div>
      </div>
      <nav class="profile-nav-content" @click="hideNavByNavigator">
        <router-link to="/profile/info"><img src="../../assets/img/icon-user.png" alt="">My Profile</router-link>
        <router-link to="/profile/social"><img src="../../assets/img/icon-social.png" alt="">My Social Networks</router-link>
        <router-link to="/profile/rates"><img src="../../assets/img/icon-rates.png" alt="">My Rates</router-link>
        <router-link to="/profile/address"><img src="../../assets/img/icon-address.png" alt="">Shipping Address</router-link>
        <router-link to="/profile/payment"><img src="../../assets/img/icon-pay.png" alt="">Payment Details</router-link>
        <router-link to="/profile/changePassword"><img src="../../assets/img/icon-change-pwd.png" alt="">Change Password</router-link>
      </nav>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ProfileNav",

  data() {
    return {
      navStatus: false
    };
  },

  props: {
    complete: {
      type: Number,
      default: 0
    }
  },

  computed: {
    ...mapState([ "winW", "winH", "userInfo" ]),
    avatar() {
      return this.userInfo.headimg || require("../../assets/img/avatar.jpg");
    }
  },

  methods: {
    showNav() {
      if (this.winW > 750) { return false; }
      this.navStatus = true;
    },

    hideNav(e) {
      if (e.target !== e.currentTarget) { return false; }
      e.stopPropagation();
      this.navStatus = false;
    },

    hideNavByNavigator() {
      this.navStatus = false;
    },

    /**
     * 选择头像
     */
    chooseAvatar(e) {
      let file = e.target.files[0];
      if (file) {
        this.$store.commit("setAvatarPageStatus", true);
        setTimeout(() => {
          console.log("chooseAvatar...");
          this.proxyVue.$emit("uploadAvatar", file);
          e.target.value = "";
        }, 500);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";

.profile-nav-box {
  width: 25%;
  max-width: 400px;
  background-color: #dfdfdf;

  .profile-nav-top {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    background-color: #f0143c;

    .avatar-wrapper {
      @include pr;
      .avatar-file {
        @include full;
        opacity: 0;
        max-width: 100%;
      }
      .profile-nav-toggle {
        display: none;
      }
    }
    .profile-avatar {
      width: 100%;
      height: 100%;
      border: 2px solid #fff;
      box-sizing: border-box;
      border-radius: 50%;
      background-color: #ccc;
    }
    .add-avatar-btn {
      display: block;
      width: 20px;
      height: 20px;
      @include pa;
      right: 2px;
      bottom: 2px;
      cursor: pointer;
    }
    .profile-nickname {
      display: flex;
      flex-direction: column;
      color: #fff;
      width: calc(100% - 88px);
      strong {
        font-family: "VegurB";
      }
      .profile-msg {
        display: flex;
        align-items: center;
        font-family: "VegurEL";
        justify-content: space-between;
        .profile-msg-count {
          display: flex;
        }
        img {
          margin-right: 5px;
        }
        .profile-complete {
          margin-right: 6px;
          white-space: nowrap;
        }
      }
    }
  }

  .profile-nav-content {
    display: flex;
    flex-direction: column;

    a {
      color: #757575;
      white-space: nowrap;
      font-family: "VegurEL";
      line-height: 3;
      background-color: #eaeaea;
      border-bottom: 1px solid #fff;
      display: flex;
      align-items: center;
      box-sizing: border-box;

      &.router-link-active {
        background-color: #fff;
        color: #070707;
        font-family: "VegurR";
      }
      &:hover {
        color: #070707;
        font-family: "VegurR";
      }
    }
  }
}

@media screen and (min-width: 1600px) {
  .profile-nav-box {
    .profile-nav-top {
      padding: 20px 20px;
      .avatar-wrapper {
        width: 84px;
        height: 84px;
        margin-right: 15px;
      }
      .profile-nickname {
        strong {
          font-size: 30px;
          margin-bottom: 12px;
        }
        .profile-msg {
          font-size: 24px;
        }
      }
    }

    .profile-nav-content {
      a {
        font-size: 22px;
        padding-left: 10%;
        img {
          margin-right: 10px;
        }
      }
    }
  }
}

@media screen and (min-width: 1366px) and (max-width: 1599px) {
  .profile-nav-box {
    .profile-nav-top {
      padding: 15px 15px;
      .avatar-wrapper {
        width: 76px;
        height: 76px;
        margin-right: 12px;
      }
      .profile-nickname {
        strong {
          font-size: 26px;
          margin-bottom: 10px;
        }
        .profile-msg {
          font-size: 22px;
          img {
            width: 20px;
          }
        }
      }
    }

    .profile-nav-content {
      a {
        font-size: 22px;
        padding-left: 7%;
        img {
          width: 22px;
          margin-right: 8px;
        }
      }
    }
  }
}

@media screen and (min-width: 1080px) and (max-width: 1365px) {
  .profile-nav-box {
    .profile-nav-top {
      padding: 10px 10px;
      .avatar-wrapper {
        width: 70px;
        height: 70px;
        margin-right: 12px;
      }
      .profile-nickname {
        width: calc(100% - 82px);
        strong {
          font-size: 22px;
          margin-bottom: 8px;
        }
        .profile-msg {
          font-size: 20px;
          img {
            width: 18px;
          }
        }
      }
    }

    .profile-nav-content {
      a {
        font-size: 20px;
        padding-left: 7%;
        img {
          width: 20px;
          margin-right: 7px;
        }
      }
    }
  }
}

@media screen and (min-width: 900px) and (max-width: 1079px) {
  .profile-nav-box {
    .profile-nav-top {
      padding: 8px 8px;
      .avatar-wrapper {
        width: 60px;
        height: 60px;
        margin-right: 6px;
      }
      .profile-nickname {
        width: calc(100% - 66px);
        strong {
          font-size: 20px;
          margin-bottom: 6px;
        }
        .profile-msg {
          font-size: 18px;
          img {
            width: 16px;
            margin-right: 3px;
          }
          .profile-complete {
            margin-right: 0;
            font-size: 18px;
          }
        }
      }
    }

    .profile-nav-content {
      a {
        font-size: 18px;
        padding-left: 5%;
        img {
          width: 18px;
          margin-right: 5px;
        }
      }
    }
  }
}

@media screen and (min-width: 751px) and (max-width: 899px) {
  .profile-nav-box {
    .profile-nav-top {
      padding: 8px 8px;
      .avatar-wrapper {
        width: 50px;
        height: 50px;
        margin-right: 5px;
        .add-avatar-btn {
          width: 15px;
          height: 15px;
          bottom: 0;
          right: 0;
        }
      }
      .profile-nickname {
        width: calc(100% - 55px);
        strong {
          font-size: 20px;
          margin-bottom: 4px;
        }
        .profile-msg {
          font-size: 16px;
          img {
            width: 14px;
            margin-right: 3px;
          }
          .profile-complete {
            margin-right: 0;
            font-size: 16px;
            padding-left: 2px;
          }
        }
      }
    }

    .profile-nav-content {
      a {
        font-size: 18px;
        padding-left: 2.5%;
        img {
          width: 18px;
          margin-right: 3px;
        }
      }
    }
  }
}

@media screen and (min-width: 641px) and (max-width: 750px) {
  .profile-nav-box {
    width: 30%;
    .profile-nav-top {
      padding: 8px 8px;
      .avatar-wrapper {
        width: 40px;
        height: 40px;
        margin-right: 8px;
        .add-avatar-btn {
          width: 15px;
          height: 15px;
          bottom: 0;
          right: 0;
        }
      }
      .profile-nickname {
        width: calc(100% - 48px);
        strong {
          font-size: 20px;
          margin-bottom: 4px;
        }
        .profile-msg {
          font-size: 16px;
          img {
            width: 14px;
            height: 14px;
            margin-right: 3px;
          }
          .profile-complete {
            margin-right: 0;
          }
        }
      }
    }

    .profile-nav-content {
      a {
        font-size: 18px;
        padding-left: 4%;
        img {
          width: 18px;
          margin-right: 5px;
        }
      }
    }
  }
}

@media screen and (max-width: 640px) {
  .profile-nav-box {
    max-width: 100%;
    @include pf;
    left: 0px;
    top: 46px;
    width: px2rem(80px);
    height: px2rem(80px);
    z-index: 100;
    overflow: hidden;
    background: none;
    transition: all 0.35s, background 0s;

    .profile-nav-main {
      width: 50%;
      transition: all 0.35s;
    }

    .profile-nav-top {
      padding: 0;
      background: none;
      flex-wrap: nowrap;
      transition: all 0.35s;
      .avatar-wrapper {
        min-width: px2rem(80px);
        max-width: px2rem(80px);
        min-height: px2rem(80px);
        height: px2rem(80px);
        margin-right: px2rem(10px);
        border-radius: 50%;
        background-color: #ccc;
        .add-avatar-btn {
          visibility: hidden;
        }
        .profile-nav-toggle {
          display: block;
          @include pa;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          &.hide {
            display: none;
          }
        }
      }
      .profile-nickname {
        width: calc(100% - 50px);
        strong {
          font-size: px2rem(34px);
          margin-bottom: px2rem(6px);
        }
        .profile-msg {
          font-size: px2rem(26px);
          img {
            width: px2rem(24px);
            height: px2rem(24px);
            margin-right: px2rem(5px);
          }
        }
      }
    }

    .profile-nav-content {
      max-width: 100%;
      overflow: hidden;
      a {
        font-size: px2rem(30px);
        padding-left: 5%;
        img {
          width: px2rem(30px);
          margin-right: px2rem(10px);
        }
      }
    }

    &.full {
      background: rgba(255, 255, 255, 0.7);
      width: 100%;
      height: 100%;
      .profile-nav-main {
        width: 50%;
        height: 100%;
        background-color: #dfdfdf;
      }

      .profile-nav-top {
        padding: px2rem(10px);
        background-color: #f0143c;
        .avatar-wrapper {
          width: px2rem(80px);
          height: px2rem(80px);
          margin-right: px2rem(10px);
          .add-avatar-btn {
            visibility: visible;
            width: px2rem(24px);
            height: px2rem(24px);
            bottom: px2rem(2px);
            right: px2rem(2px);
          }
        }
        .profile-nickname {
          strong {
            font-size: px2rem(34px);
            margin-bottom: px2rem(6px);
          }
          .profile-msg {
            font-size: px2rem(26px);
            img {
              width: px2rem(24px);
              height: px2rem(24px);
              margin-right: px2rem(5px);
            }
          }
        }
      }

      .profile-nav-content {
        a {
          font-size: px2rem(30px);
          padding-left: 5%;
          img {
            width: px2rem(30px);
            margin-right: px2rem(10px);
          }
        }
      }
    }
  }
}
</style>
