<template>
  <section class="profile-edit-wrapper">
    <div class="profile-edit-content">
      <div class="system-tips" v-if="systemTips && systemTips !== 'loading'">{{ systemTips }}</div>
      <div class="profile-social-title">
        <h2>My Rates</h2>
        <p>Please fill in your average rate per post across different social media platforms for reference. We will take it into account when selecting you for possible collaborations.</p>
      </div>
      <div class="profile-rates-main">
        <form @submit.prevent="ratesSubmit">
          <div class="profile-rates-datum">
            <label>Preferred Currency</label>
            <div class="profile-info profile-border">{{ rates.currency }}</div>
          </div>
          <div class="profile-rates-list">
            <div class="profile-rates-details">
              <div class="profile-rates-name">
                <strong><i class="fa fa-instagram" aria-hidden="true"></i></strong>
                <span>Instagram</span>
              </div>
              <div class="profile-rates-post">
                <div class="profile-rates-post-info">
                  <strong>Instagram post</strong>
                  <span>Static image post</span>
                </div>
                <div class="profile-rates-post-control">
                  <!--<input class="profile-rates-post-input" type="text" placeholder="USD$">-->
                  <div class="profile-info profile-border">{{ rates.currency | currencyIcon }} {{ rates.ins_img | formatNum }}</div>
                </div>
              </div>
              <div class="profile-rates-post">
                <div class="profile-rates-post-info">
                  <strong>Instagram video post</strong>
                  <span>1 self-created video post</span>
                </div>
                <div class="profile-rates-post-control">
                  <!--<input class="profile-rates-post-input" type="text" placeholder="USD$">-->
                  <div class="profile-info profile-border">{{ rates.currency | currencyIcon }} {{ rates.ins_video | formatNum }}</div>
                </div>
              </div>
              <div class="profile-rates-post">
                <div class="profile-rates-post-info">
                  <strong>Instagram story post</strong>
                  <span>Up to 3 frames, <br>includes a swipe up link</span>
                </div>
                <div class="profile-rates-post-control">
                  <!--<input class="profile-rates-post-input" type="text" placeholder="USD$">-->
                  <div class="profile-info profile-border">{{ rates.currency | currencyIcon }} {{ rates.ins_story | formatNum }}</div>
                </div>
              </div>
              <div class="profile-rates-post">
                <div class="profile-rates-post-info">
                  <strong>IGTV</strong>
                  <span>1 IGTV post</span>
                </div>
                <div class="profile-rates-post-control">
                  <!--<input class="profile-rates-post-input" type="text" placeholder="USD$">-->
                  <div class="profile-info profile-border">{{ rates.currency | currencyIcon }} {{ rates.igvt | formatNum }}</div>
                </div>
              </div>
            </div>
            <div class="profile-rates-details">
              <div class="profile-rates-name">
                <strong><i class="fa fa-youtube-play" aria-hidden="true"></i></strong>
                <span>YouTube Rates</span>
              </div>
              <div class="profile-rates-post">
                <div class="profile-rates-post-info">
                  <strong>1 Video (15-20mins)</strong>
                  <span>1 self-created video<br>Mentions with a link in description</span>
                </div>
                <div class="profile-rates-post-control">
                  <!--<input class="profile-rates-post-input" type="text" placeholder="USD$">-->
                  <div class="profile-info profile-border">{{ rates.currency | currencyIcon }} {{ rates.youtube_video | formatNum }}</div>
                </div>
              </div>
            </div>
            <!--<div class="profile-rates-details">
              <div class="profile-rates-name">
                <strong><img src="../../assets/img/icon-tiktok.png" alt=""></strong>
                <span>TikTok Rates</span>
              </div>
              <div class="profile-rates-post">
                <div class="profile-rates-post-info">
                  <strong>1 Video Post</strong>
                  <span>1 self-created video<br>Mentions with a link</span>
                </div>
                <div class="profile-rates-post-control">
                  &lt;!&ndash;<input class="profile-rates-post-input" type="text" placeholder="USD$">&ndash;&gt;
                  <div class="profile-info profile-border">{{ rates.currency | currencyIcon }} {{ rates.tiktok_video | formatNum }}</div>
                </div>
              </div>
            </div>-->
          </div>
          <div class="info-tips"></div>
          <router-link to="/profile/rates/edit" class="info-sub profile-edit-btn">
            Edit
          </router-link>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
// import Loading from "../Loading";

export default {
  name: "Rates",

  data() {
    return {
      formTips: "",
      isRefer: false
    }
  },

  filters: {
    formatNum(num) {
      if (!num) { return num; }
      num = num.toString().split(".");
      return num[0].split("").reverse().reduce((prev, cur, index) => {
        return (index % 3 ? cur : (cur + ",")) + prev;
      }) + "." + num[1];

      /*return num.toString().split("").reverse().reduce((prev, cur, index) => {
        return (index % 3 ? cur : (cur + ",")) + prev;
      });*/
    },

    currencyIcon(val) {
      return typeof val !== "undefined" ? val.split("-")[1] : "";
    }
  },

  props: ["systemTips", "rates"],

  components: {
  },

  methods: {
    ratesSubmit() {

    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/profile/rates";
</style>
