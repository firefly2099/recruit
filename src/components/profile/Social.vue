<template>
  <section class="profile-edit-wrapper">
    <div class="profile-edit-content">
      <div class="system-tips" v-if="systemTips && systemTips !== 'loading'">{{ systemTips }}</div>
      <div class="profile-social-title">
        <h2>Social Networks </h2>
        <p>Connect all your social accounts you want to use for the campaigns you participate in. </p>
      </div>
      <form>
        <ul class="profile-social-list">
          <li>
            <div class="profile-social-name">
              <strong><i class="fa fa-instagram" aria-hidden="true"></i></strong>
              <!--<span>Instagram</span>-->
            </div>
            <div class="social-control readonly" >{{ social.ins_url }}</div>
            <!--<a class="profile-social-connect" href="#">Connect Instagram</a>-->
          </li>
          <li>
            <div class="profile-social-name">
              <strong><i class="fa fa-facebook" aria-hidden="true"></i></strong>
              <!--<span>Facebook</span>-->
            </div>
            <!--<a class="profile-social-connect" href="#">Connect Facebook</a>-->
            <div class="social-control readonly" >{{ social.facebook_url }}</div>
          </li>
          <li>
            <div class="profile-social-name">
              <strong><i class="fa fa-youtube-play" aria-hidden="true"></i></strong>
              <!--<span>YouTube</span>-->
            </div>
            <!--<a class="profile-social-connect" href="#">Connect YouTube</a>-->
            <div class="social-control readonly" >{{ social.youtube_url }}</div>
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
        <router-link class="info-sub profile-edit-btn" to="/profile/social/edit">Edit</router-link>
      </form>
    </div>
  </section>
</template>

<script>
// import Loading from "../Loading";

export default {
  name: "Social",

  props: ["systemTips", "social"],

  data() {
    return {
      isRefer: false,
      formTips: ""
    }
  },

  components: {
    // Loading
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/profile/social";
</style>
