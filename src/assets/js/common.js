export default {
  install(Vue) {
    Vue.prototype.redirectSignIn = function() {
      console.log("redirectSignIn line 4:", this.$route);
      this.$store.dispatch("clearUserInfo");
      return this.$router.replace({ path: "/signIn", query: { url: this.$route.fullPath } });
    };
  }
}
