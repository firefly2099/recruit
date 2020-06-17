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
          <h2 class="signup-title">JOIN ONLIVE CLUB</h2>
          <h6 class="signup-subtitle">Join the Club and be the first to connect with exciting opportunities.<br>Make the most of your talent and influence.</h6>
          <div class="signup-form-box">
            <form id="signup-form" @submit.prevent="signUpSubmit" ref="signUpForm">
              <div class="signup-datum">
                <div class="signup-datum">
                  <input type="text" id="username" class="signup-form-control" placeholder="Username*" name="username" v-model.trim="username" :class="{ 'has-error': usernameError }" @input="checkedValue('username', 'usernameError')">
                  <div class="signup-validate" :class="{ 'has-error': usernameError }">
                    <span class="signup-control-tips">{{ usernameError }}</span>
                  </div>
                </div>
              </div>
              <div class="signup-datum-parent">
                <div class="signup-datum">
                  <input type="email" id="email" class="signup-form-control" placeholder="Email*" name="email" v-model.trim="email" :class="{ 'has-error': emailError }" @input="checkedValue('email', 'emailError')">
                  <div class="signup-validate" :class="{ 'has-error': emailError }">
                    <span class="signup-control-tips">{{ emailError }}</span>
                  </div>
                </div>
                <div class="signup-datum-code-wrap">
                  <div class="signup-datum">
                    <input type="tel" id="code" class="signup-form-control" placeholder="Verification code*" name="username" v-model.trim="code" :class="{ 'has-error': codeError }" @input="checkedValue('code', 'codeError')" autocomplete="off">
                    <div class="signup-validate" :class="{ 'has-error': codeError }">
                      <span class="signup-control-tips">{{ codeError }}</span>
                    </div>
                  </div>
                  <button class="signup-code-btn" type="button" @click="getCode" :disabled="isWaitingCode">
                    <template v-if="codeDuration <= 0">Send code</template>
                    <template v-else>{{ codeDuration }}s</template>
                  </button>
                </div>
              </div>
              <div class="signup-datum-parent">
                <div class="signup-datum">
                  <!--<input type="date" class="signup-form-control" placeholder="Date of birth*">-->
                  <Datepicker placeholder="Date of birth*" input-class="signup-form-control" type="date" format="MM/dd/yyyy" name="birth" required @input="chooseDate">
                    <div slot="afterDateInput" class="signup-validate" :class="{ 'has-error': dateError }">
                      <span class="signup-control-tips">{{ dateError }}</span>
                    </div>
                  </Datepicker>
                </div>
                <div class="signup-datum">
                  <input type="text" id="location" class="signup-form-control" placeholder="Location*" v-model.trim="location" :class="{ 'has-error': locationError }" @input="checkedValue('location', 'locationError')">
                  <div class="signup-validate" :class="{ 'has-error': locationError }">
                    <span class="signup-control-tips">{{ locationError }}</span>
                  </div>
                </div>
              </div>
              <div class="signup-datum">
                <input type="password" id="password" class="signup-form-control" placeholder="Password*" v-model.trim="password" :class="{ 'has-error': passwordError }" @input="checkedValue('password', 'passwordError')" minlength="8">
                <div class="signup-validate" :class="{ 'has-error': passwordError }">
                  <span class="signup-control-tips">{{ passwordError }}</span>
                  <em class="password-minimum">(8characters minimum)</em>
                </div>
              </div>
              <div class="signup-datum">
                <input type="password" id="repeatPassword" class="signup-form-control" placeholder="Repeat your password*" v-model.trim="repeatPassword" :class="{ 'has-error': repeatPasswordError }" @input="checkedValue('repeatPassword', 'repeatPasswordError')" minlength="8">
                <div class="signup-validate" :class="{ 'has-error': repeatPasswordError }">
                  <span class="signup-control-tips">{{ repeatPasswordError }}</span>
                </div>
              </div>
              <div class="signup-datum">
                <input type="text" class="signup-form-control" placeholder="How did you hear about us?" v-model.trim="source">
                <div class="signup-validate">
                  <span class="signup-control-tips"></span>
                </div>
              </div>
              <div class="signup-agreement" :class="{ checked: acceptedAgreement }" @click="checkAgreement">
                <span></span><p>I have read and accept the <a @click="showAgreement(1)"> User Agreement </a> and <a @click="showAgreement(2)"> Influencer Agreement </a></p>
              </div>
              <div class="signup-tips">{{ formTips }}</div>
              <button type="submit" class="signup-sub" :class="{ disabled: !acceptedAgreement}" :disabled="isRefer">
                <template v-if="isRefer">
                  <Loading></Loading>
                </template>
                <template v-else>
                  Create  Account
                </template>
              </button>
              <div class="signup-have-account">Already have an account? <router-link to="/signIn">Sign in</router-link></div>
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
import Datepicker from 'vuejs-datepicker';
import Loading from "./Loading";
import signUpMixin from "../assets/js/signUp";

import { mapState } from "vuex";

export default {
  name: "SignUp",

  mixins: [ signUpMixin ],

  components: {
    Datepicker,
    Loading
  },

  data() {
    return {
      acceptedAgreement: false,
      formTips: "",
      isRefer: false,
      codeDuration: 0,
      isWaitingCode: false,
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

    checkAgreement(e) {
      if (e.target.nodeName.toUpperCase() !== "A") {
        this.acceptedAgreement = !this.acceptedAgreement;
        this.formTips = !this.acceptedAgreement ? "Please check the agreement." : "";
      }
    },

    /**
     * 查看协议
     * @param id
     */
    showAgreement(id) {
      this.proxyVue.$emit("viewAgreement", id);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/css/common";

.signup-datum-code-wrap {
  display: flex;
  justify-content: space-between;
  width: calc(50% - 8px);

  .signup-datum {
    width: 60% !important;
    .signup-form-control {
      border-right: none;
    }
  }

  .signup-code-btn {
    width: 40%;
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
          cursor: pointer;
          &:active {
            color: #e22a18;
          }
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
        width: 360px;
        height: 70px;
        line-height: 70px;
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
      width: calc(60%) !important;
    }

    .signup-code-btn {
      width: 40%;
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

