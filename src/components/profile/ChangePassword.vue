<template>
  <section class="profile-edit-wrapper">
    <div class="profile-edit-content">
      <div class="profile-social-title">
        <h2>Change password</h2>
      </div>
      <form ref="changePasswordForm" @submit.prevent="changePasswordSubmit">
        <div class="profile-edit-datum">
          <label>Enter the correct password</label>
          <input class="profile-edit-control" type="password" name="currentPass" ref="currentPass" v-model="info.currentPass" @input="checkedValue('info.currentPass', 'errors.currentPass')">
          <div class="signup-validate" :class="{ 'has-error': errors.currentPass }">
            <span class="signup-control-tips">{{ errors.currentPass }}</span>
          </div>
        </div>
        <div class="profile-edit-datum">
          <label>Enter a new password</label>
          <input class="profile-edit-control" type="password" name="newPass" ref="newPass" v-model="info.newPass" @input="checkedValue('info.newPass', 'errors.newPass')">
          <div class="signup-validate" :class="{ 'has-error': errors.newPass }">
            <span class="signup-control-tips">{{ errors.newPass }}</span>
          </div>
        </div>
        <div class="profile-edit-datum">
          <label>Re-enter the new password</label>
          <input class="profile-edit-control" type="password" name="repassword" ref="repassword" v-model="info.repassword" @input="checkedValue('info.repassword', 'errors.repassword')">
          <div class="signup-validate" :class="{ 'has-error': errors.repassword }">
            <span class="signup-control-tips">{{ errors.repassword }}</span>
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

export default {
  name: "ChangePassword",

  components: {
    Loading
  },

  data() {
    return {
      errors: {
        currentPass: "",
        newPass: "",
        repassword: ""
      },
      info: {
        currentPass: "",
        newPass: "",
        repassword: ""
      },
      formTips: "",
      isRefer: false,
    };
  },

  methods: {
    /**
     * 提交新密码
     */
    changePasswordSubmit() {
      if (!this.validate()) { return false; }

      this.formTips = "";
      this.isRefer = true;

      let params = new FormData();
      params.append("currentPass", this.info.currentPass);
      params.append("newPass", this.info.newPass);
      params.append("repassword", this.info.repassword);

      this.isRefer = true;
      this.$store.dispatch("modifyPassword", params)
        .then(res => {
          if (+res.code === 1000) {
            this.redirectSignIn();
            return Promise.reject(new Error("redirect..."));
          }

          if (+res.code === 1) {
            this.formTips = res.info;
            return true;
          } else {
            this.formTips = res.info;
          }
          this.isRefer = false;
        })
        .then(() => {
          return this.$store.dispatch("logout");
        })
        .then(data => {
          this.isRefer = false;
          Object.assign(this.$data.info, this.$options.data().info);
          if (+data.code === 1) {
            this.formTips = "";
            this.$router.replace("/signIn");
          } else {
            this.formTips = data.info;
          }
        })
        .catch(e => {
          this.formTips = e.message || e;
          this.isRefer = false;
        });
    },

    /**
     * 验证表单
     * @returns {boolean}
     */
    validate() {
      if (!this.info.currentPass) {
        this.errors.currentPass = "Can not be empty";
        this.$refs.currentPass.focus();
        return false;
      }

      if (!this.info.newPass) {
        this.errors.newPass = "Can not be empty";
        this.$refs.newPass.focus();
        return false;
      }

      if (this.info.newPass.length < 8) {
        this.errors.newPass = "At least 8 characters";
        this.$refs.newPass.focus();
        return false;
      }

      if (this.info.newPass === this.info.currentPass) {
        this.errors.newPass = "The new password is the same as the old password";
        this.$refs.newPass.focus();
        return false;
      }

      if (!this.info.repassword) {
        this.errors.repassword = "Can not be empty";
        this.$refs.repassword.focus();
        return false;
      }

      if (this.info.repassword !== this.info.newPass) {
        this.errors.repassword = "Two passwords are inconsistent";
        this.$refs.repassword.focus();
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
    },
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
      font-size: 46px;
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
    min-height: px2rem(30px);
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
    /*text-transform: uppercase;*/
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
        font-size: 42px;
        margin-bottom: 12px;
      }
      p{
        font-size: 20px;
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
        font-size: 40px;
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
        height: 34px;
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
        font-size: 38px;
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
        font-size: 16px;
      }
      .profile-edit-control {
        height: 32px;
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
      padding-top: px2rem(100px);
      margin-bottom: px2rem(80px);
    }

    .profile-social-title {
      margin-bottom: 25px;
      h2 {
        font-size: px2rem(54px);
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
        font-size: 16px;
      }
      .profile-edit-control {
        height: 30px;
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
