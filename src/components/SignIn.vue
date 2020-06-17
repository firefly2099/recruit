<template>
  <section class="signin-wrapper" :class="{ dialog: isDialog }">
    <transition-group tag="div" class="signin-content" name="fade">
      <div v-if="loginStatus === 0" key="1">
        <div class="waiting-for-login">
          <Loading color="black"></Loading>
        </div>
      </div>
      <div v-else-if="loginStatus === 1" key="2">
        <div class="signin-top">
          <h2 class="signin-title">Sign in</h2>
          <h6 class="signin-subtitle"><a to="/signUp" href="javascript:;" @click="createAccount">Create an Account</a></h6>
        </div>
        <div class="signin-form-box">
          <form id="signin-form" @submit.prevent="login" ref="signInForm">
            <div class="signin-datum">
              <input type="text" class="signin-form-control" placeholder="Username or email*" v-model="info.username" ref="username" :class="{ 'has-error': errorCode === 1 }" @input="checkedValue">
            </div>
            <div class="signin-datum">
              <input type="password" class="signin-form-control" placeholder="Password*" v-model="info.password" ref="password" :class="{ 'has-error': errorCode === 2 }" @input="checkedValue">
            </div>
            <div class="signin-agreement">
              <strong class="signin-remember" :class="{ checked: remember }" @click="rememberAccount"><span></span>Remember me</strong>
              <a to="/forgotPassword" class="signin-forgot" @click="hideSignInDialog">Forgot your password?</a>
            </div>
            <div class="signin-tips">{{ formTips }}</div>
            <button type="submit" class="signin-sub" :disabled="isRefer">
              <template v-if="isRefer">
                <Loading></Loading>
              </template>
              <template v-else>
                SIGN IN
              </template>
            </button>
          </form>
        </div>
      </div>
      <div v-else key="3">
        <div class="waiting-for-login" style="font-size: 30px;">
          Already logged in.
        </div>
      </div>
    </transition-group>
  </section>
</template>

<script>
import Loading from "./Loading";

import { mapState } from "vuex";

export default {
  name: "SignIn",

  data() {
    return {
      remember: localStorage.getItem("info") ? JSON.parse(this.unCompileStr(localStorage.getItem("info"))).remember ? JSON.parse(this.unCompileStr(localStorage.getItem("info"))).remember : false : false,
      isRefer: false,
      formTips: "",
      errorCode: 0,
      info: {
        username: localStorage.getItem("info") ? JSON.parse(this.unCompileStr(localStorage.getItem("info"))).username : "",
        password: localStorage.getItem("info") ? JSON.parse(this.unCompileStr(localStorage.getItem("info"))).token ? JSON.parse(this.unCompileStr(localStorage.getItem("info"))).token : "" : ""
      }
    };
  },

  components: {
    Loading
  },

  props: [ "isDialog" ],

  computed: {
    ...mapState([ "winW", "loginStatus" ])
  },

  watch: {
    loginStatus: {
      handler(val) {
        if (val === 2) {
          this.redirect();
        }
      },
      immediate: true
    }
  },

  created() {
  },

  mounted() {
  },

  beforeRouteEnter(to, from, next) {
    console.info("signIn beforeRouteEnter...", to, from);
    // next(true);
    next(vm => {  console.log(vm);
      if (vm.loginStatus === 2) {
        // vm.$router.replace(vm.$route.query.url || from.path || "/");
        vm.redirect();
      } else {
        return true;
      }
    });
  },

  methods: {
    createAccount() {
      this.$parent.hideSignInDialog();
      this.$router.push("/signUp");
    },

    /**
     * 页面重定向
     */
    redirect() {
      console.log("signIn redirect, this.$route.query.url:", this.$route.query.url);
      this.$router.replace(this.$route.query.url || "/");
    },

    /**
     * 记住密码
     */
    rememberAccount() {
      this.remember = !this.remember;
    },

    hideSignInDialog() {
      if (!this.$route.path.match("/signIn")) {
        this.$parent.hideSignInDialog();
      }
      this.$router.push("/forgotPassword");
    },

    /**
     * 检查输入字段
     */
    checkedValue() {
      this.errorCode = 0;
      this.formTips = "";
    },

    /**
     * 登录
     */
    login() {
      if (!this.validate()) { return false; }
      this.errorCode = 0;
      this.refer();
    },

    /**
     * 验证登录表单
     */
    validate() {
      if (!this.info.username) {
        this.formTips = "Username can not be empty";
        this.errorCode = 1;
        this.$refs.username.focus();
        return false;
      }

      if (!this.info.password) {
        this.formTips = "Password can not be empty";
        this.errorCode = 2;
        this.$refs.password.focus();
        return false;
      }

      return true;
    },

    /**
     * 提交登录
     */
    refer() {
      this.isRefer = true;
      let signInData = new FormData();
      signInData.append("username", this.info.username);
      signInData.append("password", this.info.password);
      signInData.append("remember", this.remember ? "on" : "off");

      this.$store.dispatch("signIn", signInData)
        .then(res => {
          this.isRefer = false;
          this.formTips = res.info;
          if (+res.code === 1) { // success
            this.rememberInfo();

            if (this.winW <= 750) {
              this.proxyVue.$emit("setNavStatus", false);
            }

            if (this.$route.path.match("/signIn")) {
              setTimeout(() => {
                this.formTips = "";
                // this.$router.replace(this.$route.query.url || "/")
                //   .catch(data => console.log("data:",data));
              }, 1000);
            } else {
              this.formTips = "";
              this.$parent.hideSignInDialog();
            }
            this.$store.dispatch("checkLogin");
          }
        }).catch(e => {
        this.isRefer = false;
        this.formTips = e.message || e;
      });
    },

    rememberInfo() {
      let info = {};
      info.username = this.info.username;
      if (this.remember) {
        info.token = this.info.password;
        info.remember = this.remember;
      }
      localStorage.setItem("info", this.compileStr(JSON.stringify(info)));
    },

    //对字符串进行加密
    compileStr(code){
      let c=String.fromCharCode(code.charCodeAt(0)+code.length);
      for(let i=1;i<code.length;i++){
        c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));
      }
      return encodeURIComponent(c);
    },
    //字符串进行解密
    unCompileStr(code){
      code = decodeURIComponent(code);
      let c=String.fromCharCode(code.charCodeAt(0)-code.length);
      for(let i=1;i<code.length;i++){
        c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));
      }
      return c;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/css/common";

.signin-wrapper {
  background-color: #f0f0f0;
  padding: 120px 0;
  box-sizing: border-box;

  .signin-content {
    width: 100%;
    max-width: 640px;
    padding: 0 10px;
    margin: 0 auto;
    text-align: center;
    box-sizing: border-box;
    @include pr;

    .signin-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 2px solid #070707;
      padding: 5px 0;
      margin-bottom: 34px;
    }
    .signin-title {
      color: #070707;
      font-size: 32px;
      font-family: "VegurR";
      font-weight: 600;
    }

    .signin-subtitle {
      color: #070707;
      font-size: 20px;
      font-family: "VegurR";

      a {
        color: #070707;
        transition: color 0.25s;
        &:hover {
          /*text-decoration: underline;*/
          color: #50a0d9;
        }
      }
    }

    .signin-form-box {
      .signin-datum {
        width: 100%;
        margin-bottom: 30px;
      }
      .signin-form-control {
        width: 100%;
        height: 40px;
        box-sizing: border-box;
        border: 1px solid #b2b2b2;
        padding: 0 10px;
        font-size: 20px;
        font-family: "VegurEL";
        font-weight: 600;

        &:focus {
          border-color: #a6a6a6;
          box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.3);
        }

        &.has-error {
          border-color: #ff0000;
        }
      }
      .signin-agreement {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
        font-weight: bold;
        padding: 0 2px;

        .signin-remember {
          font-size: 20px;
          font-family: "VegurR";
          display: flex;
          user-select: none;
          text-align: left;
          span {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: 2px solid #cbcbcb;
            margin-right: 8px;
            @include pr;
            margin-top: -1px;
            transition: border-color 0.2s;
          }

          &.checked {
            span {
              border-color: #f0143c;
              &:after {
                display: block;
                content: "";
                @include pa;
                width: 8px;
                height: 8px;
                background-color: #f0143c;
                border-radius: 50%;
                left: 3px;
                top: 3px;
              }
            }
          }
        }
        .signin-forgot {
          cursor: pointer;
          font-size: 20px;
          font-family: "VegurR";
          color: #070707;
          text-decoration: underline;
          text-underline-color: #727272;
          text-align: right;
          &:hover {
            color: #585858;
          }
        }
      }
      .signin-tips {
        height: px2rem(30px);
        line-height: px2rem(30px);
        margin-bottom: px2rem(6px);
        font-family: "VegurR";
        font-size: px2rem(24px);
        color: #f0143c;
      }
      .signin-sub {
        width: 100%;
        height: 60px;
        line-height: 60px;
        margin: 0 auto;
        background-color: #f0143c;
        color: #fff;
        font-size: 28px;
        font-family: "VegurB";
        border-radius: 5px;
        &:hover {
          background-color: #f0282b;
        }
        &:active {
          transform: scale(0.99);
        }
        &.disabled,
        &:disabled {
          background-color: #ccc;
          &:active {
            transform: scale(1);
          }
        }
      }
      .signin-have-account {
        padding: 20px 0;
        color: #757575;
        font-size: 24px;
        font-family: "VegurEL";
        font-weight: bold;
      }
    }
  }

  &.dialog {
    padding: 50px 0;
    width: 100%;
    background-color: #fff;

    .signin-content {
      padding: 0 40px;
    }
  }
}

@media screen and (max-width: 750px) {
  .signin-wrapper {
    padding: px2rem(80px) 0;

    .signin-content {
      .signin-content {
        padding: 0 px2rem(20px);
      }

      .signin-title {
        font-size: px2rem(40px);
      }
      .signin-subtitle {
        font-size: px2rem(26px);
      }

      .signin-form-box {
        .signin-agreement {
          align-items: center;
          .signin-remember {
            font-size: px2rem(32px);
            /*align-items: center;*/
            span {
              margin-right: px2rem(8px);
              width: px2rem(14px);
              height: px2rem(14px);
              margin-top: px2rem(2px);
            }
            &.checked {
              span {
                &:after {
                  display: block;
                  width: px2rem(8px);
                  height: px2rem(8px);
                  left: px2rem(3px);
                  top: px2rem(3px);
                }
              }
            }
          }
          .signin-forgot {
            font-size: px2rem(28px);
          }
        }

        .signin-sub {
          font-size: px2rem(40px);
          height: px2rem(80px);
          line-height: px2rem(80px);
        }
      }
    }
  }
}
</style>
