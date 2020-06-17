<template>
  <section class="signup-wrapper">
    <div class="signup-content" name="fade">
      <!--<template v-if="loginStatus === 0">
        <div class="waiting-for-login" :key="loginStatus + '1'">
          <Loading color="black"></Loading>
        </div>
      </template>-->
      <!--<template v-else-if="loginStatus === 1">-->
        <div>
          <h2 class="signup-title">CONTACT US</h2>
          <h6 class="signup-subtitle">How can we help?<br>Email us</h6>
          <div class="signup-form-box">
            <form id="signup-form" @submit.prevent="contactSubmit" ref="contactForm">
              <div class="signup-datum-parent">
                <div class="signup-datum">
                  <input type="text" ref="firstName" class="signup-form-control" placeholder="First name" v-model.trim="info.firstName" :class="{ 'has-error': errors.firstName }" @input="checkedValue('info.firstName', 'errors.firstName')">
                  <div class="signup-validate" :class="{ 'has-error': errors.firstName }">
                    <span class="signup-control-tips">{{ errors.firstName }}</span>
                  </div>
                </div>
                <div class="signup-datum">
                  <input type="text" ref="lastName" class="signup-form-control" placeholder="Last name" v-model.trim="info.lastName" :class="{ 'has-error': errors.lastName }" @input="checkedValue('info.lastName', 'errors.lastName')">
                  <div class="signup-validate" :class="{ 'has-error': errors.lastName }">
                    <span class="signup-control-tips">{{ errors.lastName }}</span>
                  </div>
                </div>
              </div>
              <div class="signup-datum">
                <input type="email" ref="email" class="signup-form-control" placeholder="Email address" name="email" v-model.trim="info.email" :class="{ 'has-error': errors.email }" @input="checkedValue('info.email', 'errors.email')">
                <div class="signup-validate" :class="{ 'has-error': errors.email }">
                  <span class="signup-control-tips">{{ errors.email }}</span>
                </div>
              </div>
              <div class="signup-datum">
                <textarea class="contact-area" name="" ref="message" placeholder="Message" cols="30" rows="5" v-model.trim="info.message" :class="{ 'has-error': errors.message }" @input="checkedValue('info.message', 'errors.message')"></textarea>
                <div class="signup-validate" :class="{ 'has-error': errors.message }">
                  <span class="signup-control-tips">{{ errors.message }}</span>
                </div>
              </div>
              <div class="signup-tips">{{ formTips }}</div>
              <button type="submit" class="signup-sub" :disabled="isRefer">
                <template v-if="isRefer">
                  <Loading></Loading>
                </template>
                <template v-else>
                  SEND EMAIL
                </template>
              </button>
            </form>
          </div>
        </div>
      <!--</template>-->

      <!--<template v-else>
        <div :key="loginStatus + '3'">
          <div class="waiting-for-login" style="font-size: 30px;">
            Already logged in.
          </div>
        </div>
      </template>-->
    </div>
  </section>
</template>

<script>
import Loading from "./Loading";
import signUpMixin from "../assets/js/signUp";

import { mapState } from "vuex";

export default {
  name: "Contact",

  mixins: [ signUpMixin ],

  components: {
    Loading
  },

  data() {
    return {
      formTips: "",
      isRefer: false,
      info: {
        firstName: "",
        lastName: "",
        email: "",
        message: ""
      },
      errors: {
        firstName: "",
        lastName: "",
        email: "",
        message: ""
      },
      emailRegExp: /^([a-zA-Z0-9_\.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    }
  },

  computed: {
    ...mapState([ "winW" ])
  },

  /*beforeRouteEnter(to, from, next) {
    // next(vm => {
      // console.info("$route:", vm.$route);
      // console.info("$router:", vm.$router.currentRoute, vm.$router.options.routes[3]);
    // });
  },*/

  beforeRouteUpdate(to, from, next) {
    console.info("$route to:", to, from);
    next();
  },

  methods: {
    /**
     * 提交留言信息
     * @param e
     * @returns {boolean}
     */
    contactSubmit(e) {
      e.preventDefault();
      if (!this.validate()) { return false; }
      this.refer();
    },

    /**
     * 验证表单
     * @returns {boolean}
     */
    validate() {
      if (!this.info.firstName) {
        this.errors.firstName = "Can not be empty";
        this.$refs.firstName.focus();
        return false;
      }

      if (!this.info.lastName) {
        this.errors.lastName = "Can not be empty";
        this.$refs.lastName.focus();
        return false;
      }

      if (!this.info.email) {
        this.errors.email = "Can not be empty";
        this.$refs.email.focus();
        return false;
      }

      if (!this.emailRegExp.test(this.info.email)) {
        this.errors.email = "Incorrect mailbox format";
        this.$refs.email.focus();
        return false;
      }

      if (!this.info.message) {
        this.errors.message = "Can not be empty";
        this.$refs.message.focus();
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
        if (this.emailRegExp.test(this.$data[attrs[0]][attrs[1]])) {
          this.$data[attrFlags[0]][attrFlags[1]] = "";
          return true;
        } else {
          this.$data[attrFlags[0]][attrFlags[1]] = "Incorrect mailbox format";
          return false;
        }
      }
    },

    /**
     * 提交留言信息
     */
    refer() {
      this.isRefer = true;
      let formData = new FormData();
      formData.append("first_name", this.info.firstName);
      formData.append("last_name", this.info.lastName);
      formData.append("email", this.info.email);
      formData.append("message", this.info.message);

      this.$store.dispatch("contact", formData)
        .then(res => {
          this.isRefer = false;
          this.formTips = res.info;
          if (+res.code === 1) { // success
            this.reset();
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
      Object.assign(this.$data.info, this.$options.data().info);
      Object.assign(this.$data.errors, this.$options.data().errors);
    },

  }
};
</script>

<style lang="scss" scoped>
@import "../assets/css/common";

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
      font-family: "VegurR";
      line-height: 1.2;
      margin-bottom: 50px;
      font-weight: 500;
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

.contact-area {
  width: 100%;
  height: 150px;
  box-sizing: border-box;
  background: none;
  padding: 10px;
  font-size: 20px;
  font-family: "VegurEL";
  font-weight: 600;
  line-height: 1.2;
  resize: vertical;

  &:focus {
    border-color: #a6a6a6;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.3);
  }

  &.has-error {
    border-color: #ff0000;
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


