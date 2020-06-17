<template>
  <section class="profile-edit-wrapper">
    <div class="profile-edit-content">
      <div class="system-tips" v-if="systemTips && systemTips !== 'loading'">{{ systemTips }}</div>
      <div class="profile-social-title">
        <h2>Bank Transfer</h2>
        <p>Please fill in the payment details to make sure you get paid quickly after completing a campaign.</p>
      </div>
      <form ref="bankTransferForm" @submit.prevent="bankTransferSubmit">
        <div class="profile-edit-datum">
          <label>Bank country or region</label>
          <select class="profile-edit-control" name="country" v-model="payment.country" ref="country" @change="chooseCountry">
            <option v-for="country of countries" :value="country.name" :key="country.code">{{ country.name }}</option>
          </select>
          <div class="signup-validate" :class="{ 'has-error': errors.country }">
            <span class="signup-control-tips">{{ errors.country }}</span>
          </div>
        </div>
        <div class="profile-edit-datum">
          <label>Bank Number</label>
          <input class="profile-edit-control" type="text" name="bank_number" v-model="payment.bank_number" ref="bankNumber" @input="checkedValue('payment.bank_number', 'errors.bankNumber')">
          <div class="signup-validate" :class="{ 'has-error': errors.bankNumber }">
            <span class="signup-control-tips">{{ errors.bankNumber }}</span>
          </div>
        </div>
        <div class="profile-edit-datum">
          <label>IBAN/Bank Account name</label>
          <input class="profile-edit-control" type="text" name="account_number" v-model="payment.account_number" ref="accountNumber" @input="checkedValue('payment.account_number', 'errors.accountNumber')">
          <div class="signup-validate" :class="{ 'has-error': errors.accountNumber }">
            <span class="signup-control-tips">{{ errors.accountNumber }}</span>
          </div>
        </div>
        <div class="profile-edit-datum">
          <label>Bank Name</label>
          <input class="profile-edit-control" type="text" name="bank_name" v-model="payment.bank_name" ref="bankName" @input="checkedValue('payment.bank_name', 'errors.bankName')">
          <div class="signup-validate" :class="{ 'has-error': errors.bankName }">
            <span class="signup-control-tips">{{ errors.bankName }}</span>
          </div>
        </div>
        <div class="profile-edit-datum">
          <label>Bank Address <em>Line 1</em></label>
          <input class="profile-edit-control" type="text" name="bank_address_1" v-model="payment.bank_address_1" ref="bankAddress" @input="checkedValue('payment.bank_address_1', 'errors.bankAddress')">
          <div class="signup-validate" :class="{ 'has-error': errors.bankAddress }">
            <span class="signup-control-tips">{{ errors.bankAddress }}</span>
          </div>
        </div>
        <div class="profile-edit-datum">
          <label>Bank Address <em>Line 2</em></label>
          <input class="profile-edit-control" type="text" name="bank_address_2" v-model="payment.bank_address_2" ref="bankAddress_2" @input="checkedValue('payment.bank_address_2', 'errors.bankAddress')">
        </div>
        <div class="profile-edit-datum">
          <label>Bank Address <em>Line 3</em></label>
          <input class="profile-edit-control" type="text" name="bank_address_3" v-model="payment.bank_address_3" ref="bankAddress_3" @input="checkedValue('payment.bank_address_3', 'errors.bankAddress')">
        </div>
        <!--<div class="profile-edit-datum">
          <label>City</label>
          <input class="profile-edit-control" type="text" name="city" v-model="payment.city" ref="city" @input="checkedValue('payment.city', 'errors.city')">
          <div class="signup-validate" :class="{ 'has-error': errors.city }">
            <span class="signup-control-tips">{{ errors.city }}</span>
          </div>
        </div>-->
        <!--<div class="profile-edit-datum">
          <label>State/Province</label>
          <input class="profile-edit-control" type="text" name="state" v-model="payment.state" ref="state">
        </div>-->
        <div class="profile-edit-datum" v-if="statesData != null">
          <label>State/Province</label>
          <!--<input class="profile-edit-control" type="text">-->
          <select class="profile-edit-control" name="state" v-model="payment.state" @change="chooseState">
            <option v-for="state of states" :value="state.name" :key="state.code">{{ state.name }}</option>
          </select>
        </div>
        <div class="profile-edit-datum" v-if="citiesData != null">
          <label>City</label>
          <!--<input class="profile-edit-control" type="text">-->
          <select class="profile-edit-control" name="city" v-model="payment.city">
            <option v-for="city of cities" :value="city.name" :key="city.code">{{ city.name }}</option>
          </select>
        </div>
        <div class="profile-edit-datum">
          <label>SWIFT Code</label>
          <input class="profile-edit-control" type="text" name="code" v-model="payment.code" ref="code" @input="checkedValue('payment.code', 'errors.code')">
          <div class="signup-validate" :class="{ 'has-error': errors.code }">
            <span class="signup-control-tips">{{ errors.code }}</span>
          </div>
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

import countriesData from "../../assets/js/countriesDataMixin";

export default {
  name: "BankTransfer",

  props: ["systemTips", "payment"],
  mixins: [ countriesData ],

  components: {
    Loading
  },

  data() {
    return {
      errors: {
        country: "",
        city: "",
        bankNumber: "",
        accountNumber: "",
        bankName: "",
        bankAddress: "",
        code: ""
      },
      formTips: "",
      isRefer: false,
      type: 2,
      time: 0,
    };
  },

  computed: {
    initData() {
      return this.payment;
    },
  },

  mounted() {
    window.addEventListener("popstate", () => {
      /*console.log("profile event:", event, "\n", event.target.location.href, document.referrer);
      if (event.target.location.href.indexOf("/payment") !== -1) {
        this.getPayment();
        return false;
      }*/
    }, false);
    console.log("BankTransfer mounted time:", ++this.time);
  },

  deactivated() {
    console.log("BankTransfer deactivated time:", ++this.time);
    Object.assign(this.$data.errors, this.$options.data().errors);
  },

  methods: {
    /**
     * 验证表单
     * @returns {boolean}
     */
    validate() {
      if (!this.payment.country) {
        this.errors.country = "Can not be empty";
        this.$refs.country.focus();
        return false;
      }

      if (!this.payment.bank_number) {
        this.errors.bankNumber = "Can not be empty";
        this.$refs.bankNumber.focus();
        return false;
      }

      if (!this.payment.account_number) {
        this.errors.accountNumber = "Can not be empty";
        this.$refs.accountNumber.focus();
        return false;
      }

      if (!this.payment.bank_name) {
        this.errors.bankName = "Can not be empty";
        this.$refs.bankName.focus();
        return false;
      }

      if (!(this.payment.bank_address_1 || this.payment.bank_address_2 || this.payment.bank_address_3)) {
        this.errors.bankAddress = "Can not be empty";
        this.$refs.bankAddress.focus();
        return false;
      }

      if (!this.payment.city) {
        this.errors.city = "Can not be empty";
        this.$refs.city.focus();
        return false;
      }

      if (!this.payment.code) {
        this.errors.code = "Can not be empty";
        this.$refs.code.focus();
        return false;
      }

      return true;
    },

    /**
     * 检查字段值
     */
    checkedValue(attr, attrFlag) {
      let attrs = attr.split("."),
        attrFlags = attrFlag.split(".");

      if (this.$props[attrs[0]][attrs[1]]) {
        this.$data[attrFlags[0]][attrFlags[1]] = "";
      }
    },

    /**
     * 提交银行账号
     * @returns {boolean}
     */
    bankTransferSubmit() {
      if (!this.validate()) { return false; }
      this.formTips = "";

      let params = new FormData(this.$refs.bankTransferForm);
      params.append("type", this.type);
      // params.append("id", this.payment.id);
      // params.append("country", this.payment.country);
      // params.append("city", this.payment.city);
      // params.append("state", this.payment.state);
      // params.append("bank_name", this.payment.bank_name);
      // params.append("bank_number", this.payment.bank_number);
      // params.append("account_number", this.payment.account_number);
      // params.append("bank_address_1", this.payment.bank_address_1);
      // params.append("bank_address_2", this.payment.bank_address_2);
      // params.append("bank_address_3", this.payment.bank_address_3);
      // params.append("code", this.payment.code);

      if (this.payment.id) {
        params.append("id", this.payment.id);
      }

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
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";

.profile-edit-wrapper {
  background-color: #fff;
  padding-left: 50px;
  padding-right: 50px;
  box-sizing: border-box;

  .profile-edit-content {
    width: 600px;
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
      font-size: 48px;
      font-family: "VegurB";
      margin-bottom: 20px;
    }

    p {
      color: #070707;
      font-family: "VegurEL";
      font-size: 24px;
      font-weight: 600;
      line-height: 1.5;
    }
  }

  .profile-edit-datum {
    width: 100%;
    padding: 5px 0;
    label {
      color: #070707;
      font-size: 20px;
      font-family: "VegurR";
      line-height: 1.5;
      em {
        display: block;
        /*margin-top: -5px;*/
        line-height: 1.1;
      }
    }
    .profile-edit-control,
    .profile-edit-textarea {
      width: 100%;
      font-size: 20px;
      height: 40px;
      border: 1px solid #b2b2b2;
      padding: 0 10px;
      box-sizing: border-box;
      &:focus {
        border-color: #a6a6a6;
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.3);
      }
    }
    .profile-edit-textarea {
      height: 100px;
      padding-top: 5px;
      padding-bottom: 5px;
    }

    .profile-edit-labels {
      display: flex;
      flex-wrap: wrap;
      span {
        font-size: 20px;
        padding: 8px 15px;
        border: 1px solid #b2b2b2;
        margin-right: 24px;
        margin-bottom: 20px;
        font-family: "VegurR";
        cursor: pointer;
        &:hover {
          color: #f0143c;
        }
        &.checked {
          color: #f0143c;
          border-color: #f0143c;
        }
      }
    }

    .add-label {
      display: flex;
      align-items: center;
      color: #b2b2b2;
      font-size: 20px;
      font-family: "VegurEL";
      font-weight: 600;
      cursor: pointer;
      &:hover {
        color: #868686;
        span {
          background-color: #868686;
        }
      }
      span {
        background-color: #b2b2b2;
        font-size: 18px;
        color: #fff;
        width: 34px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        margin-right: 10px;
        transition: background-color 0.2s;
      }
    }

    .profile-edit-file {
      width: 124px;
      height: 38px;
      @include pr;
      text-align: center;

      span {
        display: block;
        width: 100%;
        height: 100%;
        line-height: 38px;
        background-color: #b2b2b2;
        color: #fff;
        font-size: 20px;
        font-family: "VegurEL";
        border-radius: 5px;
        transition: background-color 0.2s;
      }
      input {
        width: 100%;
        height: 100%;
        overflow: hidden;
        @include pa;
        left: 0;
        top: 0;
        opacity: 0;
      }

      &:hover {
        span {
          background-color: #868686;
        }
      }
    }
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

@media screen and (min-width: 1366px) and (max-width: 1599px) {
  .profile-edit-wrapper {
    .profile-edit-content {
      padding-top: 50px;
      margin-bottom: 70px;
    }

    .profile-social-title {
      margin-bottom: 25px;
      h2 {
        font-size: 44px;
        margin-bottom: 12px;
      }
      p{
        font-size: 24px;
      }
    }

    .profile-edit-datum {
      label {
        font-size: 18px;
        line-height: 1.6;
      }
      .profile-edit-control,
      .profile-edit-textarea {
        font-size: 18px;
      }
      .profile-edit-control {
        height: 36px;
      }
    }

    .info-sub {
      font-size: 24px;
      height: 60px;
      width: 300px;
      margin-bottom: 60px;
    }
  }
}

@media screen and (min-width: 1080px) and (max-width: 1365px) {
  .profile-edit-wrapper {
    .profile-edit-content {
      padding-top: 40px;
      margin-bottom: 60px;
    }

    .profile-social-title {
      margin-bottom: 25px;
      h2 {
        font-size: 42px;
        margin-bottom: 12px;
      }
      p{
        font-size: 23px;
      }
    }

    .profile-edit-datum {
      label {
        font-size: 18px;
        line-height: 1.6;
      }
      .profile-edit-control,
      .profile-edit-textarea {
        font-size: 18px;
      }
      .profile-edit-control {
        height: 36px;
      }
    }

    .info-sub {
      font-size: 24px;
      height: 60px;
      width: 300px;
      margin-bottom: 60px;
    }
  }
}

@media screen and (min-width: 900px) and (max-width: 1079px) {
  .profile-edit-wrapper {
    .profile-edit-content {
      padding-top: 30px;
      margin-bottom: 50px;
    }

    .profile-social-title {
      margin-bottom: 25px;
      h2 {
        font-size: 42px;
        margin-bottom: 12px;
      }
      p{
        font-size: 23px;
      }
    }

    .profile-edit-datum {
      label {
        font-size: 18px;
        line-height: 1.6;
      }
      .profile-edit-control,
      .profile-edit-textarea {
        font-size: 18px;
      }
      .profile-edit-control {
        height: 36px;
      }
    }

    .info-sub {
      font-size: 24px;
      height: 60px;
      width: 300px;
      margin-bottom: 50px;
    }
  }
}

@media screen and (min-width: 751px) and (max-width: 899px) {
  .profile-edit-wrapper {
    .profile-edit-content {
      padding-top: 30px;
      margin-bottom: 50px;
    }

    .profile-social-title {
      margin-bottom: 25px;
      h2 {
        font-size: 42px;
        margin-bottom: 12px;
      }
      p{
        font-size: 23px;
        line-height: 1.35;
      }
    }

    .profile-edit-datum {
      label {
        font-size: 18px;
        line-height: 1.6;
      }
      .profile-edit-control,
      .profile-edit-textarea {
        font-size: 18px;
      }
      .profile-edit-control {
        height: 36px;
      }
    }

    .info-sub {
      font-size: 20px;
      height: 50px;
      width: 270px;
      margin-bottom: 50px;
    }
  }
}

@media screen and (min-width: 641px) and (max-width: 750px) {
  .profile-edit-wrapper {
    padding-left: 20px;
    padding-right: 20px;
    .profile-edit-content {
      padding-top: px2rem(30px);
      margin-bottom: px2rem(40px);
    }

    .profile-social-title {
      margin-bottom: 25px;
      h2 {
        font-size: 42px;
        margin-bottom: 12px;
      }
      p{
        font-size: 23px;
        line-height: 1.35;
      }
    }

    .profile-edit-datum {
      label {
        font-size: 18px;
        line-height: 1.6;
      }
      .profile-edit-control,
      .profile-edit-textarea {
        font-size: 18px;
      }
      .profile-edit-control {
        height: 36px;
      }
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
      padding-top: px2rem(80px);
      margin-bottom: px2rem(80px);
    }

    .profile-social-title {
      margin-bottom: 25px;
      h2 {
        font-size: px2rem(58px);
        margin-bottom: px2rem(16px);
      }
      p{
        font-size: px2rem(32px);
        line-height: 1.35;
      }
    }

    .profile-edit-datum {
      label {
        font-size: 18px;
        line-height: 1.6;
      }
      .profile-edit-control,
      .profile-edit-textarea {
        font-size: 18px;
      }
      .profile-edit-control {
        height: 36px;
      }
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
