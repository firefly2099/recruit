export default {
  methods: {
    /**
     * 获取验证码
     */
    getCode() {
      if (this.isWaitingCode) { return false; }

      if (!this.checkedValue("email", "emailError")) {
        return false;
      }

      this.isWaitingCode = true;

      let params = new FormData();
      params.append("contact_mail", this.email);
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
}
