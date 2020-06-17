<template>
  <section class="profile-edit-wrapper">
    <div class="profile-edit-content">
      <div class="profile-social-title">
        <h2>Social Networks </h2>
        <p>Connect all your social accounts you want to use for the campaigns you participate in. </p>
      </div>
      <form ref="socialEditForm" @submit.prevent="editSocialSubmit">
        <ul class="profile-social-list">
          <li>
            <div class="profile-social-name">
              <strong><i class="fa fa-instagram" aria-hidden="true"></i></strong>
              <!--<span>Instagram</span>-->
            </div>
            <input type="text" class="social-control" name="ins_url" placeholder="HTTPS://URL" v-model="social.ins_url">
            <!--<a class="profile-social-connect" href="#">Connect Instagram</a>-->
          </li>
          <li>
            <div class="profile-social-name">
              <strong><i class="fa fa-facebook" aria-hidden="true"></i></strong>
              <!--<span>Facebook</span>-->
            </div>
            <!--<a class="profile-social-connect" href="#">Connect Facebook</a>-->
            <input type="text" class="social-control" name="facebook_url" placeholder="HTTPS://URL" v-model="social.facebook_url">
          </li>
          <li>
            <div class="profile-social-name">
              <strong><i class="fa fa-youtube-play" aria-hidden="true"></i></strong>
              <!--<span>YouTube</span>-->
            </div>
            <!--<a class="profile-social-connect" href="#">Connect YouTube</a>-->
            <input type="text" class="social-control" name="youtube_url" placeholder="HTTPS://URL" v-model="social.youtube_url">
          </li>
          <!--<li>
            <div class="profile-social-name">
              <strong><img src="../../assets/img/icon-tiktok.png" alt=""></strong>
              <span>TikTok</span>
            </div>
            <a class="profile-social-connect" href="#">Connect TikTok</a>
          </li>-->
        </ul>
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
  name: "SocialEdit",

  props: ["systemTips", "social"],

  data() {
    return {
      isRefer: false,
      formTips: ""
    }
  },

  components: {
    Loading
  },

  methods: {
    /**
     * 提交社交账号
     */
    editSocialSubmit() {
      let params = new FormData(this.$refs.socialEditForm);
      // params.append("id", this.social.id);
      // params.append("ins_url", this.social.ins_url);
      // params.append("facebook_url", this.social.facebook_url);
      // params.append("youtube_url", this.social.youtube_url);

      if (this.social.id) {
        params.set("id", this.social.id);
      }

      this.isRefer = true;
      this.$store.dispatch("modifySocial", params)
        .then(res => {
          if (+res.code === 1000) {
            return this.redirectSignIn();
          }

          if (+res.code === 1) {
            this.$parent.getPerfectInfo();
            this.$router.replace("/profile/social");
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
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/profile/social";
</style>
