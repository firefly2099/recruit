<template>
  <section class="profile-edit-wrapper">
    <div class="profile-edit-content">
      <div class="system-tips" v-if="systemTips && systemTips !== 'loading'">{{ systemTips }}</div>
      <div class="profile-social-title">
        <h2>My Rates</h2>
        <p>Please fill in your average rate per post across different social media platforms for reference. We will take it into account when selecting you for possible collaborations.</p>
      </div>
      <div class="profile-rates-main">
        <form @submit.prevent="ratesSubmit" ref="ratesEditForm">
          <div class="profile-rates-datum">
            <label>Preferred Currency</label>
            <select class="profile-rates-select" name="currency" v-model="rates.currency">
              <!--<option value="" disabled>Select one</option>-->
              <option v-for="currency of currencies" :key="currency.cc" :value="currency.cc + '-' + currency.symbol">{{ currency.cc + "-" + currency.symbol + " (" + currency.name + ")" }}</option>
            </select>
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
                  <input class="profile-rates-post-input" type="text" :placeholder="currencyIcon" name="ins_img" v-model="rates.ins_img">
                </div>
              </div>
              <div class="profile-rates-post">
                <div class="profile-rates-post-info">
                  <strong>Instagram video post</strong>
                  <span>1 self-created video post</span>
                </div>
                <div class="profile-rates-post-control">
                  <input class="profile-rates-post-input" type="text" :placeholder="currencyIcon" name="ins_video" v-model="rates.ins_video">
                </div>
              </div>
              <div class="profile-rates-post">
                <div class="profile-rates-post-info">
                  <strong>Instagram story post</strong>
                  <span>Up to 3 frames, <br>includes a swipe up link</span>
                </div>
                <div class="profile-rates-post-control">
                  <input class="profile-rates-post-input" type="text" :placeholder="currencyIcon" name="ins_story" v-model="rates.ins_story">
                </div>
              </div>
              <div class="profile-rates-post">
                <div class="profile-rates-post-info">
                  <strong>IGTV</strong>
                  <span>1 IGTV post</span>
                </div>
                <div class="profile-rates-post-control">
                  <input class="profile-rates-post-input" type="text" :placeholder="currencyIcon" name="igvt" v-model="rates.igvt">
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
                  <input class="profile-rates-post-input" type="text" :placeholder="currencyIcon" name="youtube_video" v-model="rates.youtube_video">
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
                  <input class="profile-rates-post-input" type="text" :placeholder="currencyIcon" v-model="rates.tiktok_video">
                </div>
              </div>
            </div>-->
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
    </div>
  </section>
</template>

<script>
import Loading from "../Loading";

import axios from "axios";

export default {
  name: "RatesEdit",

  data() {
    return {
      formTips: "",
      isRefer: false,
      currencies: []
    }
  },

  props: ["systemTips", "rates"],

  components: {
    Loading
  },

  computed: {
    currencyIcon() {
      return typeof this.rates.currency !== "undefined" ? this.rates.currency.split("-")[1] : "";
    }
  },

  created() {
    // document.querySelector(".profile-rates-select").value = "";
    if (!this.currencies.length) {
      this.getCurrencies();
    }
  },

  methods: {
    /**
     * 获取各国货币数据
     */
    getCurrencies() {
      axios({
        url: "/data/currencies.json",
        baseURL: "",
        methods: "get"
      })
        .then(res => res.data)
        .then(data => {
          this.currencies = data;
        })
        .catch(e => {
          this.systemTips = (e.message || e);
        });
    },

    /**
     * 提交数据
     */
    ratesSubmit() {
      let params = new FormData(this.$refs.ratesEditForm);
      // params.append("id", this.rates.id);
      // params.append("currency", this.rates.currency);
      // params.append("ins_img", this.rates.ins_img);
      // params.append("ins_video", this.rates.ins_video);
      // params.append("ins_story", this.rates.ins_story);
      // params.append("igvt", this.rates.igvt);
      // params.append("youtube_video", this.rates.youtube_video);
      // params.append("tiktok_video", this.rates.tiktok_video);

      if (this.rates.id) {
        params.set("id", this.rates.id);
      }

      /*for (let [key, val] of params.entries()) {
        console.log("key:", key, " value:", val);
      }*/
      // return false;

      this.isRefer = true;
      this.$store.dispatch("modifyRates", params)
        .then(res => {
          if (+res.code === 1000) {
            return this.redirectSignIn();
          }

          if (+res.code === 1) {
            this.$parent.getPerfectInfo();
            this.$router.replace("/profile/rates");
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
@import "../../assets/css/profile/rates";
</style>
