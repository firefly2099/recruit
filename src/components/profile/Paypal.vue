<template>
  <section class="profile-edit-wrapper">
    <div class="profile-edit-content">
      <div class="system-tips" v-if="systemTips && systemTips !== 'loading'">{{ systemTips }}</div>
      <div class="profile-social-title">
        <h2>PayPal</h2>
        <p>Please fill in the payment details to make sure you get paid quickly after completing a campaign.</p>
      </div>
      <form @submit.prevent="paypalSubmit">
        <div class="profile-rates-datum">
          <label>PayPal Email</label>
          <input type="email" class="paypal-control" ref="email" v-model="email" :class="{ 'has-error': emailError }" @input="checkedValue('email', 'emailError')">
          <div class="signup-validate" :class="{ 'has-error': emailError }">
            <span class="signup-control-tips">{{ emailError }}</span>
          </div>
          <p class="paypal-email-explain">The email address you use for your PayPal account</p>
        </div>
        <div class="signup-datum-code-wrap">
          <div class="signup-datum">
            <input type="tel" ref="code" class="signup-form-control" placeholder="Verification code*" name="username" v-model.trim="code" :class="{ 'has-error': codeError }" @input="checkedValue('code', 'codeError')" autocomplete="off">
            <div class="signup-validate" :class="{ 'has-error': codeError }">
              <span class="signup-control-tips">{{ codeError }}</span>
            </div>
          </div>
          <button class="signup-code-btn" type="button" @click="getCode" :disabled="isWaitingCode">
            <template v-if="codeDuration <= 0">Send code</template>
            <template v-else>{{ codeDuration }}s</template>
          </button>
        </div>
        <div class="info-tips">{{ formTips }}</div>
        <button type="submit" class="info-sub" :disabled="isRefer">
          <template v-if="isRefer">
            <Loading></Loading>
          </template>
          <template v-else>
            Save Changes
          </template>
        </button>
      </form>
    </div>
  </section>
</template>

<script>
import Loading from "../Loading";
import verificationCode from "../../assets/js/verificationCodeMixin";

export default {
  name: "Paypal",
  props: ["systemTips", "payment"],
  mixins: [ verificationCode ],

  data() {
    return {
      formTips: "",
      isRefer: false,
      type: 1,
      email: this.payment.paypal_email,
      emailError: "",
      code: "",
      codeError: "",
      codeDuration: 0,
      isWaitingCode: false,
      emailReg: /^([a-zA-Z0-9_\.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    };
  },

  components: {
    Loading
  },

  deactivated() {
    Object.assign(this.$data.formTips, this.$options.data().formTips);
  },

  methods: {
    /**
     * 检查表单输入值
     * @param attr
     * @param attrFlag
     * @returns {boolean}
     */
    checkedValue(attr, attrFlag) {
      if (this.$data[attr]) {
        this.$data[attrFlag] = "";
      }

      if (attr === "email") {
        if (this.emailReg.test(this.$data[attr])) {
          this.$data[attrFlag] = "";
          return true;
        } else {
          this.$data[attrFlag] = "Incorrect mailbox format";
          return false;
        }
      }
    },

    /**
     * 提交paypal邮箱
     */
    paypalSubmit() {
      if (!this.validate()) { return false; }
      this.formTips = "";

      let params = new FormData();
      params.set("type", this.type);
      if (this.payment.id) {
        params.set("id", this.payment.id);
      }

      // if (this.payment.paypal_email) {
      //   params.append("paypal_email", this.payment.paypal_email);
      // }
      params.set("paypal_email", this.email);
      params.set("code", this.code);

      this.isRefer = true;
      this.$store.dispatch("modifyPayment", params)
        .then(res => {
          if (+res.code === 1000) {
            return this.redirectSignIn();
          }

          if (+res.code === 1) {
            this.$parent.getPerfectInfo();
            this.$router.replace("/profile/payment");
          } else {
            this.formTips = res.info;
          }
          this.isRefer = false;
        })
        .catch(e => {
          this.formTips = e.message || e;
          this.isRefer = false;
        });
    },

    /**
     * 验证邮箱
     */
    validate() {
      if (!this.email) {
        this.emailError = "Can not be empty";
        this.$refs.email.focus();
        return false;
      }

      if (!this.emailReg.test(this.email)) {
        this.$refs.email.focus();
        this.formTips = "Incorrect mailbox format";
        return false;
      }

      if (!this.code) {
        this.codeError = "Can not be empty";
        this.$refs.code.focus();
        return false;
      }

      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";

.signup-datum-code-wrap {
  padding-bottom: 30px;
  display: flex;
  justify-content: space-between;

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

.profile-edit-wrapper {
  /*width: 75%;*/
  background-color: #fff;
  padding-left: 50px;
  padding-right: 50px;
  box-sizing: border-box;

  .profile-edit-content {
    width: 700px;
    max-width: 100%;
    margin: 0 auto 80px;
    padding-top: 60px;
    box-sizing: border-box;
    border-bottom: 1px solid #eaeaea;
  }

  .profile-social-title {
    margin-bottom: 30px;
    h2 {
      color: #070707;
      font-size: 40px;
      font-family: "VegurB";
      margin-bottom: 20px;
    }
    p{
      color: #070707;
      font-family: "VegurEL";
      font-size: 22px;
      font-weight: 600;
      line-height: 1.5;
    }
  }

  .profile-rates-datum {
    display: flex;
    flex-direction: column;
    margin: 30px auto 30px;
    label {
      color: #070707;
      font-size: 20px;
      font-family: "VegurB";
      line-height: 2;
    }
    .paypal-control {
      height: 40px;
      border: 1px solid #b2b2b2;
      font-size: 20px;
      box-sizing: border-box;
      padding: 0 10px;
      &:focus {
        border-color: #a6a6a6;
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.3);
      }
      &.has-error {
        border-color: #ff0000;
      }
    }
  }

  .paypal-email-explain {
    color: #757575;
    font-size: 20px;
    padding: 10px 0;
    font-family: VegurEL;
    font-weight: 600;
  }

  .info-tips {
    height: px2rem(30px);
    line-height: px2rem(30px);
    margin-bottom: px2rem(6px);
    margin-top: px2rem(40px);
    font-family: "VegurR";
    font-size: px2rem(24px);
    color: #f0143c;
  }
  .info-sub {
    max-width: 100%;
    width: 360px;
    height: 70px;
    margin: 0 auto 80px;
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
}

@media screen and (min-width: 900px) and (max-width: 1079px) {
  .profile-edit-wrapper {
    .profile-edit-content {
      padding-top: 40px;
      margin-bottom: 100px;
    }

    .profile-social-title {
      margin-bottom: 20px;
      h2 {
        font-size: 42px;
        margin-bottom: 25px;
      }
      p{
        font-size: 24px;
        line-height: 1.35;
      }
    }

    .profile-rates-datum {
      margin-bottom: 30px;
      label {
        font-size: 18px;
      }
      .paypal-control {
        font-size: 18px;
        height: 36px;
      }
    }

    .paypal-email-explain {
      font-size: 18px;
    }

    .info-sub {
      font-size: 20px;
      height: 50px;
      width: 270px;
      margin-bottom: 40px;
    }
  }
}

@media screen and (min-width: 1366px) and (max-width: 1599px) {
  .profile-edit-wrapper {
    .profile-edit-content {
      padding-top: 40px;
      margin-bottom: 100px;
    }

    .profile-social-title {
      margin-bottom: 20px;
      h2 {
        font-size: 44px;
        margin-bottom: 25px;
      }
      p{
        font-size: 24px;
        line-height: 1.35;
      }
    }

    .profile-rates-datum {
      margin-bottom: 15px;
      label {
        font-size: 18px;
      }
      .paypal-control {
        font-size: 18px;
        height: 36px;
      }
    }

    .paypal-email-explain {
      font-size: 18px;
    }

    .info-sub {
      font-size: 24px;
      height: 60px;
      width: 300px;
      margin-bottom: 40px;
    }
  }
}

@media screen and (min-width: 1080px) and (max-width: 1365px) {
  .profile-edit-wrapper {
    .profile-edit-content {
      padding-top: 40px;
      margin-bottom: 100px;
    }

    .profile-social-title {
      margin-bottom: 20px;
      h2 {
        font-size: 42px;
        margin-bottom: 25px;
      }
      p{
        font-size: 24px;
        line-height: 1.35;
      }
    }

    .profile-rates-datum {
      margin-bottom: 10px;
      label {
        font-size: 18px;
      }
      .paypal-control {
        font-size: 18px;
        height: 36px;
      }
    }

    .paypal-email-explain {
      font-size: 18px;
    }

    .info-sub {
      font-size: 24px;
      height: 60px;
      width: 300px;
      margin-bottom: 40px;
    }
  }
}

@media screen and (min-width: 751px) and (max-width: 899px) {
  .profile-edit-wrapper {
    .profile-edit-content {
      padding-top: 40px;
      margin-bottom: 100px;
    }

    .profile-social-title {
      margin-bottom: 20px;
      h2 {
        font-size: 42px;
        margin-bottom: 25px;
      }
      p{
        font-size: 24px;
        line-height: 1.35;
      }
    }

    .profile-rates-datum {
      margin-bottom: 10px;
      label {
        font-size: 18px;
      }
      .paypal-control {
        font-size: 18px;
        height: 36px;
      }
    }

    .paypal-email-explain {
      font-size: 18px;
    }

    .info-sub {
      font-size: 24px;
      height: 60px;
      width: 300px;
      margin-bottom: 40px;
    }
  }
}

@media screen and (min-width: 641px) and (max-width: 750px) {
  .profile-edit-wrapper {
    padding-left: 20px;
    padding-right: 20px;

    .profile-edit-content {
      padding-top: 40px;
      margin-bottom: 100px;
    }

    .profile-social-title {
      margin-bottom: 20px;
      h2 {
        font-size: 42px;
        margin-bottom: px2rem(16px);
      }
      p{
        font-size: 24px;
        line-height: 1.35;
      }
    }

    .profile-rates-datum {
      margin-bottom: 10px;
      label {
        font-size: 16px;
      }
      .paypal-control {
        font-size: 16px;
        height: 36px;
      }
    }

    .paypal-email-explain {
      font-size: 16px;
    }

    .info-sub {
      font-size: 20px;
      height: 50px;
      width: 270px;
      margin-bottom: 40px;
    }
  }
}

@media screen and (max-width: 640px) {
  .profile-edit-wrapper {
    padding-left: px2rem(40px);
    padding-right: px2rem(40px);

    .profile-edit-content {
      margin-bottom: px2rem(120px);
    }

    .profile-social-title {
      margin-bottom: 20px;
      h2 {
        font-size: px2rem(58px);
        margin-bottom: px2rem(16px);
      }
      p{
        font-size: px2rem(34px);
        line-height: 1.35;
      }
    }

    .profile-rates-datum {
      margin-bottom: 10px;
      label {
        font-size: px2rem(30px);
      }
      .paypal-control {
        font-size: 16px;
        height: 36px;
      }
    }

    .paypal-email-explain {
      font-size: px2rem(30px);
    }

    .info-sub {
      font-size: 20px;
      height: 50px;
      width: 100%;
      margin-bottom: 40px;
    }
  }
}
</style>
