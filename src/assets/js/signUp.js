// import api from "../../api";

import verificationCode from "./verificationCodeMixin";

export default {
  mixins: [verificationCode],

  data() {
    return {
      usernameError: "",
      username: "",
      emailError: "",
      email: "",
      date: "",
      dateError: "",
      location: "",
      locationError: "",
      password: "",
      passwordError: "",
      repeatPassword: "",
      repeatPasswordError: "",
      code: "",
      codeError: "",
      source: "",
      codeTimer: null,
      emailReg: /^([a-zA-Z0-9_\.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    };
  },

  methods: {
    /**
     * 提交注册
     * @param e
     * @returns {boolean}
     */
    signUpSubmit(e) {
      e.preventDefault();
      if (!this.validate()) { return false; }
      if (!this.acceptedAgreement) {
        this.formTips = "Please check the agreement.";
        return false;
      }

      this.refer();
    },

    /**
     * 验证表单
     * @returns {boolean}
     */
    validate() {
      if (!this.username) {
        this.usernameError = "Can not be empty";
        document.querySelector("#username").focus();
        return false;
      }

      if (!this.email) {
        this.emailError = "Can not be empty";
        document.querySelector("#email").focus();
        return false;
      }

      if (!this.date) {
        this.dateError = "Can not be empty";
        return false;
      }

      if (!this.emailReg.test(this.email)) {
        this.emailError = "Incorrect mailbox format";
        return false;
      }

      if (!this.code) {
        this.codeError = "Can not be empty";
        document.querySelector("#code").focus();
        return false;
      }

      if (!this.location) {
        this.locationError = "Can not be empty";
        document.querySelector("#location").focus();
        return false;
      }

      if (!this.password) {
        this.passwordError = "Can not be empty";
        document.querySelector("#password").focus();
        return false;
      }

      if (this.password.length < 8) {
        this.passwordError = "At least 8 characters";
        document.querySelector("#password").focus();
        return false;
      }

      if (!this.repeatPassword) {
        this.repeatPasswordError = "Can not be empty";
        document.querySelector("#repeatPassword").focus();
        return false;
      }

      if (this.password !== this.repeatPassword) {
        this.repeatPasswordError = "Two passwords are inconsistent";
        document.querySelector("#repeatPassword").focus();
        return false;
      }

      if (!this.acceptedAgreement) {
        this.formTips = "";
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
      } else if (attr === "password") {
        if (this.$data[attr].length >= 8) {
          this.$data[attrFlag] = "";
        } else {
          this.$data[attrFlag] = "At least 8 characters";
        }
      } else if (attr === "repeatPassword") {
        if (this.$data["password"] === this.$data[attr]) {
          this.$data[attrFlag] = "";
        } else {
          this.$data[attrFlag] = "Two passwords are inconsistent";
        }
      }
    },

    /**
     * 选择日期
     * @param e
     */
    chooseDate(e) {
      let date = new Date(e);
      // console.log('chooseDate', date.getMonth(), date.getDate(), date.getFullYear());
      if (isNaN(date.getDate())) {
        this.date = "";
        this.dateError = "Invalid Date";
      } else {
        let d = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        this.date = d.toString() + "/" + (date.getDate() < 10 ? ('0' + (date.getDate() + 1)) : date.getDate()).toString() + "/" + date.getFullYear();
        this.dateError = "";
      }
    },

    /**
     * 日期格式化
     */
    formatDate(date) {
      if (!date) { return date; }
      let str = date.split("/");
      return str[2] + "-" + str[0] + "-" + str[1];
      // return date.split("/").reverse().join("-");
    },

    /**
     * 提交注册数据
     */
    refer() {
      this.isRefer = true;
      let signUpData = new FormData();
      signUpData.append("username", this.username);
      signUpData.append("contact_mail", this.email);
      signUpData.append("birth", this.formatDate(this.date));
      signUpData.append("location", this.location);
      signUpData.append("password", this.password);
      signUpData.append("repassword", this.repeatPassword);
      signUpData.append("remark", this.source);
      signUpData.append("code", this.code);

      console.log(this.date, signUpData.get("birth"));

      this.$store.dispatch("signUp", signUpData)
        .then(res => {
          this.isRefer = false;
          this.formTips = res.info;
          if (+res.code === 1) { // success
            this.reset();
            setTimeout(() => {
              this.$router.replace("/signIn");
            }, 1500);
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
      this.username = "";
      this.email = "";
      this.date = "";
      this.location = "";
      this.password = "";
      this.repassword = "";
      this.remark = "";
      this.code = "";
    },

  }
};
