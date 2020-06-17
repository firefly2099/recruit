<template>
  <section class="signup-wrapper">
    <transition-group tag="div" class="signup-content" name="fade">
        <template v-if="loginStatus === 0">
          <div class="waiting-for-login" :key="loginStatus + '1'">
            <Loading color="black"></Loading>
          </div>
        </template>
      <template v-else-if="loginStatus === 1">
        <div :key="loginStatus + '2'">
        <h6 class="signup-subtitle">Please enter your user name and email, we will send email to your email to reset your password.</h6>
        <div class="signup-form-box">
          <form id="signup-form" @submit.prevent="ResetPasswordSubmit" ref="resetPasswordForm">
            <!--<div class="signup-datum">
              <input type="text" id="username" class="signup-form-control" placeholder="Username*" name="username" v-model.trim="info.username" :class="{ 'has-error': error.username }" @input="checkedValue('username', 'usernameError')">
              <div class="signup-validate" :class="{ 'has-error': error.username }">
                <span class="signup-control-tips">{{ error.username }}</span>
              </div>
            </div>-->
            <div class="signup-datum">
              <input type="email" ref="email" class="signup-form-control" placeholder="Email*" name="email" v-model.trim="info.email" :class="{ 'has-error': errors.email }" @input="checkedValue('info.email', 'errors.email')">
              <div class="signup-validate" :class="{ 'has-error': errors.email }">
                <span class="signup-control-tips">{{ errors.email }}</span>
              </div>
            </div>
            <div class="signup-datum-code-wrap">
              <div class="signup-datum">
                <input type="tel" ref="code" class="signup-form-control" placeholder="Verification code*" name="username" v-model.trim="info.code" :class="{ 'has-error': errors.code }" @input="checkedValue('info.code', 'errors.code')" autocomplete="off">
                <div class="signup-validate" :class="{ 'has-error': errors.code }">
                  <span class="signup-control-tips">{{ errors.code }}</span>
                </div>
              </div>
              <button class="signup-code-btn" type="button" @click="getCode" :disabled="isWaitingCode">
                <template v-if="codeDuration <= 0">Send code</template>
                <template v-else>{{ codeDuration }}s</template>
              </button>
            </div>
            <div class="signup-datum">
              <input type="password" ref="password" class="signup-form-control" placeholder="New password*" v-model.trim="info.password" :class="{ 'has-error': errors.password }" @input="checkedValue('info.password', 'errors.password')" minlength="8">
              <div class="signup-validate" :class="{ 'has-error': errors.password }">
                <span class="signup-control-tips">{{ errors.password }}</span>
                <em class="password-minimum">(8characters minimum)</em>
              </div>
            </div>
            <div class="signup-datum">
              <input type="password" ref="repeatPassword" class="signup-form-control" placeholder="Repeat your password*" v-model.trim="info.repassword" :class="{ 'has-error': errors.repassword }" @input="checkedValue('info.repassword', 'errors.repassword')" minlength="8">
              <div class="signup-validate" :class="{ 'has-error': errors.repassword }">
                <span class="signup-control-tips">{{ errors.repassword }}</span>
              </div>
            </div>
            <div class="signup-tips">{{ formTips }}</div>
            <button type="submit" class="signup-sub" :class="{ disabled: isRefer}" :disabled="isRefer">
              <template v-if="isRefer">
                <Loading></Loading>
              </template>
              <template v-else>
                Confirm sending
              </template>
            </button>
          </form>
        </div>
      </div>
      </template>
      <template v-else>
        <div :key="loginStatus + '3'">
        <div class="waiting-for-login" style="font-size: 30px;">
          Already logged in.
        </div>
        </div>
      </template>
    </transition-group>
  </section>
</template>

<script>
import Loading from "./Loading";

import { mapState } from "vuex";

export default {
  name: "ForgotPassword",

  components: {
    Loading
  },

  data() {
    return {
      formTips: "",
      isRefer: false,
      codeDuration: 0,
      isWaitingCode: false,
      info: {
        username: "",
        email: "",
        code: "",
        password: "",
        repassword: "",
      },
      errors: {
        username: "",
        email: "",
        code: "",
        password: "",
        repassword: "",
      },
      emailReg: /^([a-zA-Z0-9_\.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    }
  },

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

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.loginStatus === 2) {
        // vm.$router.replace(vm.$route.query.url || from.path || "/");
        vm.redirect();
      } else {
        return true;
      }
    });
  },

  methods: {
    redirect() {
      this.$router.replace(this.$route.query.url || "/");
    },

    ResetPasswordSubmit(e) {
      e.preventDefault();
      if (!this.validate()) { return false; }

      this.refer();
    },
    /**
     * 验证表单
     * @returns {boolean}
     */
    validate() {
      this.formTips = "";
      /*if (!this.info.username) {
        this.usernameError = "Can not be empty";
        document.querySelector("#username").focus();
        return false;
      }*/

      if (!this.info.email) {
        this.errors.email = "Can not be empty";
        this.$refs.email.focus();
        return false;
      }

      if (!this.emailReg.test(this.info.email)) {
        this.errors.email = "Incorrect mailbox format";
        this.$refs.email.focus();
        return false;
      }

      if (!this.info.code) {
        this.errors.code = "Can not be empty";
        this.$refs.code.focus();
        return false;
      }

      if (!this.info.password) {
        this.errors.password = "Can not be empty";
        this.$refs.password.focus();
        return false;
      }

      if (this.info.password.length < 8) {
        this.errors.password = "At least 8 characters";
        this.$refs.password.focus();
        return false;
      }

      if (this.info.password !== this.info.repassword) {
        this.errors.repassword = "Two passwords are inconsistent";
        this.$refs.repeatPassword.focus();
        return false;
      }

      return true;
    },

    /**
     * 检查表单输入值
     * @param attr
     * @param attrFlag
     * @returns {boolean}
     */
    checkedValue(attr, attrFlag) {
      let attrs = attr.split("."),
        attrFlags = attrFlag.split(".");
      if (this.$data[attrs[0]][attrs[1]]) {
        this.$data[attrFlags[0]][attrFlags[1]] = "";
      }

      if (attrs[1] === "email") {
        if (this.emailReg.test(this.$data[attrs[0]][attrs[1]])) {
          this.$data[attrFlags[0]][attrFlags[1]] = "";
          return true;
        } else {
          this.$data[attrFlags[0]][attrFlags[1]] = "Incorrect mailbox format";
          return false;
        }
      } else if (attrs[1] === "password") {
        if (this.$data[attrs[0]][attrs[1]].length >= 8) {
          this.$data[attrFlags[0]][attrFlags[1]] = "";
        } else {
          this.$data[attrFlags[0]][attrFlags[1]] = "At least 8 characters";
        }
      } else if (attrs[1] === "repassword") {
        if (this.$data["info"]["password"] === this.$data[attrs[0]][attrs[1]]) {
          this.$data[attrFlags[0]][attrFlags[1]] = "";
        } else {
          this.$data[attrFlags[0]][attrFlags[1]] = "Two passwords are inconsistent";
        }
      }
    },

    /**
     * 提交注册数据
     */
    refer() {
      this.isRefer = true;
      let formData = new FormData();
      // formData.append("username", this.info.username);
      formData.append("contact_mail", this.info.email);
      formData.append("password", this.info.password);
      formData.append("repassword", this.info.repassword);
      formData.append("code", this.info.code);

      this.$store.dispatch("resetPassword", formData)
        .then(res => {
          this.formTips = res.info;
          if (+res.code === 1) { // success
            this.reset();
            setTimeout(() => {
              this.formTips = "";
              this.isRefer = false;
              this.codeDuration = 60;
              this.isWaitingCode = false;
              this.$router.replace("/signIn");
            }, 500);
          } else {
            this.isRefer = false;
          }
        }).catch(e => {
        this.isRefer = false;
        this.formTips = e.message || e;
      });

    },

    /**
     * 重置表单
     */
    reset() {
      // this.$refs["signUpForm"].resetFields();
      clearInterval(this.codeTimer);
      Object.assign(this.$data.info, this.$options.data().info);
    },

    /**
     * 获取验证码
     */
    getCode() {
      if (this.isWaitingCode) { return false; }
console.log("getCode:", this.checkedValue("info.email", "errors.email"));
      if (!this.checkedValue("info.email", "errors.email")) {
        return false;
      }

      this.isWaitingCode = true;

      let params = new FormData();
      params.append("contact_mail", this.info.email);
      this.$store.dispatch("sendCode", params)
        .then(res => {
          if (+res.code === 1) {
            this.formTips = "Verification code has been sent to your email.";
            this.codeDuration = 60;
            this.reduceCodeDuration();
          } else {
            this.formTips = res.info;
          }
        })
        .catch(e => {
          this.formTips = e.message || e;
        });
    },

    /**
     * 限制验证码60s内只能获取一次
     */
    reduceCodeDuration() {
      this.codeTimer = setInterval(() => {
        if (--this.codeDuration <= 0) {
          clearInterval(this.codeTimer);
          this.isWaitingCode = false;
        }
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/css/common";

.signup-datum-code-wrap {
  display: flex;
  justify-content: space-between;
  width: 100%;

  .signup-datum {
    width: 70% !important;
    .signup-form-control {
      border-right: none;
    }
  }

  .signup-code-btn {
    width: 30%;
    height: 40px;
    /*border-top-right-radius: 3px;*/
    /*border-bottom-right-radius: 3px;*/
    background-color: #f0143c;
    font-size: 20px;
    color: #fff;
    box-sizing: border-box;
    &:active {
      transform: scale(0.99);
    }
    &:disabled {
      cursor: not-allowed;
      background-color: #929292;
    }
  }
}

.signup-wrapper {
  background-color: #f0f0f0;
  padding: 80px 0;
  box-sizing: border-box;

  .signup-content {
    width: 100%;
    max-width: 720px;
    padding: 0 10px;
    margin: 0 auto;
    text-align: center;
    box-sizing: border-box;

    .signup-title {
      color: #070707;
      font-size: 48px;
      font-family: "VegurB";
      margin-bottom: 50px;
    }

    .signup-subtitle {
      color: #070707;
      font-size: 24px;
      font-family: "VegurEL";
      line-height: 1.2;
      margin-bottom: 50px;
      font-weight: 600;
    }

    .signup-form-box {
      .signup-datum-parent {
        display: flex;
        justify-content: space-between;
        margin-bottom: 22px;
        .signup-datum {
          width: calc(50% - 8px);
          margin-bottom: 0;
        }
      }
      .signup-datum {
        width: 100%;
        margin-bottom: 22px;
      }
      /*.signup-form-control {
        width: 100%;
        height: 40px;
        box-sizing: border-box;
        border: 1px solid #b2b2b2;
        padding: 0 10px;
        font-size: 20px;
        font-family: "VegurEL";
        font-style: italic;
      }*/
      .signup-agreement {
        text-align: left;
        margin-bottom: 30px;
        font-weight: bold;
        display: flex;
        align-items: center;
        color: #070707;
        font-size: 20px;
        font-family: "VegurEL";
        user-select: none;
        a {
          color: #f0143c;
          text-decoration: underline;
          text-underline-position: under;
          margin: 0 5px;
        }
        span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          border: 4px solid #cbcbcb;
          margin-right: 10px;
          margin-top: -2px;
        }
        &.checked span {
          width: 6px;
          height: 6px;
          padding: 2px;
          border-width: 2px;
          @include pr;
          &:after {
            display: block;
            content: "";
            @include pa;
            width: 6px;
            height: 6px;
            background-color: #f0143c;
            border-radius: 50%;
            left: 2px;
            top: 2px;
          }
        }
      }
      .signup-tips {
        height: px2rem(30px);
        line-height: px2rem(30px);
        margin-bottom: px2rem(6px);
        font-family: "VegurR";
        font-size: px2rem(24px);
        color: #f0143c;
      }
      .signup-sub {
        width: 400px;
        height: 60px;
        line-height: 60px;
        margin: 0 auto;
        background-color: #f0143c;
        color: #fff;
        font-size: 28px;
        font-family: "VegurB";
        border-radius: 5px;
        cursor: pointer;
        &:hover {
          background-color: #f0282b;
        }
        &:active {
          transform: scale(0.99);
        }
        &.disabled,
        &:disabled {
          background-color: #ccc;
          cursor: not-allowed;
          &:active {
            transform: scale(1);
          }
        }
      }
      .signup-have-account {
        padding: 20px 0;
        color: #757575;
        font-size: 24px;
        font-family: "VegurEL";
        font-weight: bold;
        a {
          color: #f0143c;
          font-family: "VegurEL";
          /*font-size: 24px;*/
          text-decoration: underline;
        }
      }
    }
  }
}

@media screen and (max-width: 750px) {
  .signup-datum-code-wrap {
    width: 100%;
    .signup-datum {
      width: calc(70%) !important;
    }

    .signup-code-btn {
      width: 30%;
      height: px2rem(62px);
      /*margin-left: 8px;*/
      font-size: px2rem(24px);
    }
  }
  .signup-wrapper {
    padding: px2rem(80px) 0;
    .signup-content {
      padding: 0 px2rem(20px);
      .signup-title {
        font-size: px2rem(50px);
        margin-bottom: px2rem(50px);
      }
      .signup-subtitle {
        font-size: px2rem(32px);
        margin-bottom: px2rem(40px);
      }
      .signup-form-box {
        .signup-datum-parent {
          flex-direction: column;
          margin-bottom: 0;
          .signup-datum {
            width: 100%;
            margin-bottom: px2rem(24px);
          }
        }
        .signup-datum {
          margin-bottom: px2rem(26px);
        }
        .signup-agreement {
          margin-bottom: px2rem(40px);
          font-size: px2rem(26px);
          align-items: flex-start;
          padding: px2rem(2px) 0;
          a {
            margin: 0 px2rem(4px);
          }
          span {
            flex: 1;
            min-width: px2rem(12px);
            min-height: px2rem(12px);
            max-width: px2rem(12px);
            max-height: px2rem(12px);
            border-width: px2rem(6px);
            margin-right: px2rem(20px);
            border-radius: 50%;
            margin-top: px2rem(2px);
          }
          &.checked span {
            min-width: px2rem(10px);
            min-height: px2rem(10px);
            padding: px2rem(3px);
            border-width: px2rem(4px);
            border-radius: 50%;
            @include pr;
            &:after {
              display: block;
              content: "";
              @include pa;
              min-width: px2rem(10px);
              min-height: px2rem(10px);
              background-color: #f0143c;
              border-radius: 50%;
              left: px2rem(3px);
              top: px2rem(3px);
            }
          }
          p {
            flex: 0 1 auto;
            line-height: 1.3;
          }
        }
        .signup-tips {
          margin-bottom: px2rem(12px);
          height: px2rem(32px);
          line-height: px2rem(32px);
        }
        .signup-sub {
          width: 100%;
          height: px2rem(80px);
          line-height: px2rem(80px);
          font-size: px2rem(40px);
        }
        .signup-have-account {
          font-size: px2rem(34px);
        }
      }
    }
  }

  .signup-form-control {
    font-size: px2rem(28px);
    height: px2rem(62px);
  }

  .signup-validate {
    .signup-control-tips {
      font-size: px2rem(26px);
    }

    .password-minimum {
      font-size: px2rem(20px);
    }
  }
}
</style>
<style lang="scss">
@import "../assets/css/common";

.signup-form-control {
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
.signup-validate {
  display: flex;
  justify-content: space-between;

  .signup-control-tips {
    color: #ff0000;
    font-size: 18px;
    padding: 2px;
  }

  .password-minimum {
    color: #b9b9b9;
    font-size: 16px;
    padding: 2px;
    margin-bottom: -20px;
  }
  &.has-error .password-minimum {
    margin-bottom: 0;
  }
}
</style>

