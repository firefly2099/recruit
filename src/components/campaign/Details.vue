<template>
  <section class="campaign-details-wrapper">
    <template v-if="isLoading">
      <Loading :color="'black'" style="margin-top: 100px; margin-bottom: 100px;"></Loading>
    </template>
    <template v-else-if="errorTips">
      <div class="system-tips">{{ errorTips }}</div>
    </template>
    <template v-else>
      <div class="campaign-details-top">
        <div class="campaign-details-top-main">
          <div class="campaign-details-top-img">
            <img :src="details.local_url" alt="" width="100%">
            <!--<img src="../../assets/img/details-cover.jpg" alt="" width="100%">-->
          </div>
          <div class="campaign-details-top-brief">
            <div class="campaign-details-discount">{{ details.title_small }}</div>
            <h3 class="campaign-details-title">{{ details.title_big }}</h3>
            <div class="campaign-details-date">
              <span>Posting dates</span><strong v-date-string="{ start: details.start_time, end: details.end_time }"></strong>
            </div>
            <div class="campaigns-country">
              <span>{{ details.name }}</span>
              <img :src="details.flag_url" :alt="details.name">
              <!--<img src="../../assets/img/flag.png" :alt="campaign.country.name">-->
            </div>
            <div class="campaigns-days-left">
              <strong v-date-diff="{ start: details.start_time, end: details.end_time }"></strong> days left to apply
            </div>
            <button class="campaigns-apply-btn" v-if="details.user" :disabled="details.user">{{ details.user.status | statusToWords }}</button>
            <button v-else class="campaigns-apply-btn" @click="apply" v-date-disabled="{ end: details.end_time }">
              <template v-if="isRefer">
                <Loading></Loading>
              </template>
              <template v-else>
                Apply Now
              </template>
            </button>
          </div>
        </div>
      </div>

      <div class="campaign-details-intro">
        <div class="campaign-details-intro-main">
          <div class="campaign-details-data">
            <h5 class="campaign-brief-subject">Campaign Brief</h5>
            <div class="campaign-brief-category">{{ details.brand }}/{{ details.campaign_name }}</div>
            <!--<div v-html="details.content"></div>-->
            <ul class="campaign-brief-list">
              <li v-for="(intro, index) of details.introduce" :key="index">{{ intro }}</li>
            </ul>

            <div class="campaign-brief-category">Brand Background/Story</div>
            <ul class="campaign-brief-list">
              <li v-for="(story, index) of details.brand_story" :key="index">{{ story }}</li>
              <!--<li>Onlive Club connects talented influencers like You with brands and advertisers. </li>
              <li>We provide sponsorship opportunities for you to create ...</li>-->
            </ul>

            <div class="campaign-brief-category">About this campaign</div>
            <ul class="campaign-brief-list">
              <li v-for="(about, index) of details.about" :key="index">{{ about }}</li>
              <!--<li>Onlive Club connects talented influencers like You with brands and advertisers. </li>
              <li>We provide sponsorship opportunities for you to create ...</li>-->
            </ul>

            <div class="campaign-brief-category">Goal</div>
            <ul class="campaign-brief-list">
              <li v-for="(goal, index) of details.goal" :key="index">{{ goal }}</li>
              <!--<li>Onlive Club connects talented influencers like You with brands and advertisers. </li>-->
            </ul>
          </div>
          <div class="campaign-details-data">
            <h5 class="campaign-brief-subject">Creator Requirements</h5>
            <ul class="campaign-brief-list">
              <li v-for="(requirement, index) of details.requirement" :key="index">{{ requirement }}</li>
              <!--<li>Onlive Club connects talented influencers like You with brands and advertisers. </li>
              <li>We provide sponsorship opportunities for you to create ...</li>-->
            </ul>
            <!--<ul class="campaign-brief-list">
              <li>Onlive Club connects talented influencers like You with brands and advertisers. </li>
              <li>We provide sponsorship opportunities for you to create ...</li>
            </ul>
            <ul class="campaign-brief-list">
              <li>Onlive Club connects talented influencers like You with brands and advertisers. </li>
              <li>We provide sponsorship opportunities for you to create ...</li>
            </ul>-->
          </div>
        </div>
      </div>

      <div class="campaign-details-style">
        <div class="campaign-details-style-main">
          <h5 class="campaign-details-style-title">Style for Campaign </h5>
          <ul class="campaign-details-style-photos">
            <li v-for="(style, index) of details.style" :key="index">
              <img :src="style" alt="" width="100%">
              <!--<img src="../../assets/img/style.jpg" alt="" width="100%">-->
            </li>
            <!--<li>
              <img src="../../assets/img/style.jpg" alt="" width="100%">
            </li>
            <li>
              <img src="../../assets/img/style.jpg" alt="" width="100%">
            </li>
            <li>
              <img src="../../assets/img/style.jpg" alt="" width="100%">
            </li>-->
          </ul>
          <!--<button class="campaigns-apply-btn campaigns-apply-btn-center">Apply Now</button>-->
          <button class="campaigns-apply-btn campaigns-apply-btn-center" v-if="details.user" :disabled="details.user">{{ details.user.status | statusToWords }}</button>
          <button v-else class="campaigns-apply-btn campaigns-apply-btn-center" @click="apply" v-date-disabled="{ end: details.end_time }">
            <template v-if="isRefer">
              <Loading></Loading>
            </template>
            <template v-else>
              Apply Now
            </template>
          </button>
        </div>
      </div>
    </template>
  </section>
</template>

<script>
import Loading from "../Loading";
import campaignMixin from "../../assets/js/campaignMixin";

import { mapState } from "vuex";

export default {
  name: "Details",

  mixins: [ campaignMixin ],

  components: {
    Loading
  },

  data() {
    return {
      isLoading: true,
      errorTips: "",
      details: {},
      isRefer: false
    };
  },

  computed: {
    ...mapState(["userInfo", "loginStatus"])
  },

  filters: {
    statusToWords(status) {
      let text = "";
      switch (status) {
        case "1":
          text = "Reviewing";
          break;
        case "2":
          text = "Confirmed";
          break;
        case "3":
          text = "Reviewed unsuccessfully";
          break;
      }
      return text;
    }
  },

  created() {
    // console.info("created...", this.userInfo.username, this.loginStatus);
    // let duration = this.userInfo.username ? 0 : 10;
    // setTimeout(this.getCampaignDetail.bind(this), duration);

    if (this.loginStatus === 0) {
      let loginTimer = setInterval(() => {
        if (this.loginStatus !== 0) {
          clearInterval(loginTimer);
          this.loginIntercept(this.$route, this.loginStatus);
        }
      }, 17);
    } else {
      this.loginIntercept(this.$route, this.loginStatus);
    }
  },

  directives: {
    dateString: {
      inserted(el, binding) {
        let start = new Date(binding.value.start).toDateString(),
            end = new Date(binding.value.end).toDateString();
        start = start.substr(start.indexOf(" "));
        end = end.substr(end.indexOf(" "));
        el.innerHTML = start + " - " + end;
      }
    },

    dateDisabled(el, binding) {
      let end = +new Date(binding.value.end) + 24 * 3600 * 1000,
        now = +new Date();
      el.disabled = end < now;
    }
  },

  methods: {
    /**
     * 接口拦截(检测是否登录)
     */
    loginIntercept(path, loginStatus) {
      if (loginStatus === 2) { // 登录
        this.getCampaignDetail(path);
      }
    },

    /**
     * 查询活动详情
     */
    getCampaignDetail() {
      // console.log("getCampaignDetail:", this.$route.params.id);
      this.isLoading = true;
      this.$store.dispatch("queryCampaignDetail", {
          campaign_id: this.$route.params.id
        })
        .then(res => {
          if (+res.code === 1000) {
            return this.redirectSignIn();
          }

          if (+res.code === 1) {
            this.details = res.data;
          } else {
            return Promise.reject(res.info || res.message);
          }
          this.isLoading = false;
        })
        .catch(e => {
          // this.errorTips = JSON.stringify(e);
          this.errorTips = e.message || e;
          this.isLoading = false;
        });
    },

    /**
     * 报名
     * @returns {boolean}
     */
    apply() {
      if (this.isRefer || this.details.user) { return false; }

      this.isRefer = true;
      this.$store.dispatch("campaignApply", {
        campaign_id: this.$route.params.id
      })
        .then(res => {
          if (+res.code === 1000) {
            return this.redirectSignIn();
          }

          if (+res.code === 1) {
            this.$store.commit("setMessage", {
              code: 2,
              title: "Thank you for applying this campaign!",
              msg: "Your application is currently being reviewed.We will be reaching out to you in a few days regarding your submission. If you have any questions, please contact us via email at marketing@onlive.club."
            });
            this.details.user = {
              status: "1"
            };
          } else {
            this.$store.commit("setMessage", {
              code: 0,
              title: "",
              msg: res.info || res.message
            });
          }
          this.isRefer = false;
        })
        .catch(e => {
          this.$store.commit("setMessage", {
            code: 0,
            title: "",
            msg: e.message || JSON.stringify(e)
          });
          // console.log(JSON.stringify(e));
          this.isRefer = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";

.campaign-details-wrapper {
  box-sizing: border-box;
  background-color: #f0f0f0;
  width: 100%;
  padding: 35px;

  .campaigns-apply-btn {
    width: 360px;
    height: 70px;
    background-color: #f0143c;
    border-radius: 5px;
    color: #fff;
    font-size: 28px;
    &:hover {
      background-color: #f0282b;
    }
    &:active {
      transform: scale(0.99);
    }
    &:disabled {
      background-color: rgb(183, 183, 183);
      cursor: not-allowed;
      &:hover {
        background-color: rgb(183, 183, 183);
      }
    }
  }

  .campaign-details-top {
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #fff;

    .campaign-details-top-main {
      /*padding: 0 15px;*/
      /*max-width: 1200px;*/
      /*width: 100%;*/
      margin-left: 40px;
      margin-right: 40px;
      box-sizing: border-box;
      /*margin: 0 auto;*/
      display: flex;
      /*justify-content: space-between;*/
      .campaign-details-top-img {
        width: 47%;
        max-width: 570px;
        max-height: 570px;
        overflow: hidden;
        margin-right: 50px;
      }

      .campaign-details-top-brief {
        width: 47%;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .campaign-details-discount {
          color: #757575;
          font-size: 28px;
          font-family: VegurR;
          line-height: 1.15;
          margin-bottom: 20px;
          font-weight: 600;
        }
        .campaign-details-title {
          color: #000000;
          font-size: 44px;
          font-family: VegurB;
          line-height: 1.18;
          text-transform: uppercase;
          margin-bottom: 40px;
        }
        .campaign-details-date {
          color: #757575;
          line-height: 1.6;
          font-weight: 600;
          margin-bottom: 15px;
          span {
            display: block;
            font-size: 20px;
            font-family: VegurEL;
          }
          strong {
            font-size: 24px;
            font-family: VegurR;
          }
        }
        .campaigns-country {
          display: flex;
          align-items: center;
          span {
            font-size: 16px;
            color: #878787;
            font-family: VegurR;
            margin-right: 5px;
          }
          img {
            max-width: 23px;
          }
        }
        .campaigns-days-left {
          color: #757575;
          font-size: 16px;
          font-weight: 600;
          font-family: VegurEL;
          line-height: 2;
          margin-bottom: 30px;
          strong {
            color: #070707;
            font-weight: normal;
            font-size: 20px;
            font-family: VegurB;
          }
        }

      }
    }
  }

  .campaign-details-intro {
    padding-top: 45px;
    padding-bottom: 45px;
    background-color: #eaeaea;

    .campaign-details-intro-main {
      padding: 0 60px;
      /*max-width: 1200px;*/
      /*width: 100%;*/
      margin-left: 40px;
      margin-right: 40px;
      box-sizing: border-box;
      /*margin: 0 auto;*/
      display: flex;
      justify-content: space-between;
      @include pr;
      border-left: 1px solid #dfdfdf;
      border-right: 1px solid #dfdfdf;
      &:before {
        content: "";
        @include pa;
        width: 1px;
        background-color: #dfdfdf;
        height: 100%;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    }

    .campaign-details-data {
      width: 50%;
      &:first-child {
        padding-right: 60px;
      }
      &:last-child {
        padding-left: 60px;
      }
      .campaign-brief-subject {
        color: #070707;
        font-size: 32px;
        margin-bottom: 46px;
        text-transform: uppercase;
      }
      .campaign-brief-category {
        color: #070707;
        font-size: 26px;
        line-height: 1.5;
      }
      .campaign-brief-list {
        margin-bottom: 50px;
        &:last-child {
          margin-bottom: 0;
        }
        li {
          color: #666;
          font-size: 22px;
          font-family: VegurEL;
          font-weight: 600;
          line-height: 1.67;
          padding-left: 15px;
          white-space: pre-wrap;
          word-break: break-all;

          @include pr;
          &:before {
            content: "";
            display: inline-block;
            width: 6px;
            height: 6px;
            background-color: #666;
            /*margin-top: 5px;*/
            margin-right: 8px;
            margin-left: -15px;
            @include pr;
            top: -5px;
          }
        }
      }
    }
  }

  .campaign-details-style {
    background-color: #fff;
    .campaign-details-style-main {
      /*padding: 0 15px;*/
      /*max-width: 1200px;*/
      /*width: 100%;*/
      margin-left: 40px;
      margin-right: 40px;
      box-sizing: border-box;
      /*margin: 0 auto;*/
      overflow: hidden;

      .campaign-details-style-title {
        color: #070707;
        font-size: 44px;
        padding: 46px 0 46px;
      }
      .campaign-details-style-photos {
        display: flex;
        justify-content: space-between;
        margin-bottom: 100px;
        li {
          width: 22%;
          overflow: visible;
          img {
            transition: transform 3.5s;
          }
          &:hover {
            z-index: 1;
            img {
              transform: scale(1.15);
            }
          }
        }
      }
      .campaigns-apply-btn-center {
        margin: 0 auto 100px;
      }
    }
  }
}

@media screen and (min-width: 1600px) {
  .campaign-details-wrapper {
    .campaign-details-top {
      .campaign-details-top-main {
        .campaign-details-top-img {
          width: 40%;
        }
      }
    }
  }
}

@media screen and (min-width: 1400px) and (max-width: 1599px) {
  .campaign-details-wrapper {
    padding: 30px;
    .campaign-details-top {
      .campaign-details-top-main {
      }
    }
    .campaign-details-intro {
      .campaign-details-data {
        .campaign-brief-subject {
          font-size: 30px;
          margin-bottom: 40px;
        }
        .campaign-brief-category {
          font-size: 24px;
        }
        .campaign-brief-list {
          margin-bottom: 42px;
          li {
            font-size: 20px;
          }
        }
      }
    }

    .campaign-details-style {
      .campaign-details-style-main {
        .campaign-details-style-title {
          font-size: 40px;
          padding: 40px 0 40px;
        }

        .campaigns-apply-btn-center {
          margin-bottom: 80px;
        }
      }
    }
  }
}
@media screen and (min-width: 1280px) and (max-width: 1399px) {
  .campaign-details-wrapper {
    padding: 20px;
    .campaign-details-top {
      .campaign-details-top-main {
      }
    }

    .campaign-details-intro {
      .campaign-details-intro-main {
        padding: 0 50px;
      }
      .campaign-details-data {
        &:first-child {
          padding-right: 50px;
        }
        &:last-child {
          padding-left: 50px;
        }
        .campaign-brief-subject {
          font-size: 30px;
          margin-bottom: 30px;
        }
        .campaign-brief-category {
          font-size: 24px;
        }
        .campaign-brief-list {
          margin-bottom: 32px;
          li {
            font-size: 20px;
          }
        }
      }
    }

    .campaign-details-style {
      .campaign-details-style-main {
        .campaign-details-style-title {
          font-size: 36px;
          padding: 40px 0 40px;
        }

        .campaigns-apply-btn-center {
          margin-bottom: 70px;
        }
      }
    }
  }
}
@media screen and (min-width: 900px) and (max-width: 1279px) {
  .campaign-details-wrapper {
    padding: 20px;
    .campaign-details-top {
      padding-top: 20px !important;
      padding-bottom: 20px !important;
      .campaign-details-top-main {
        padding: 0 !important;
        margin-left: 20px;
        margin-right: 20px;
        .campaign-details-top-img {
          margin-right: 35px;
        }
      }
    }

    .campaign-details-intro {
      padding-top: 20px !important;
      padding-bottom: 20px !important;
      .campaign-details-intro-main {
        padding: 0 20px !important;
        margin-left: 20px;
        margin-right: 20px;
      }
      .campaign-details-data {
        &:first-child {
          padding-right: 20px;
        }
        &:last-child {
          padding-left: 20px;
        }
        .campaign-brief-subject {
          font-size: 28px !important;
          margin-bottom: 24px !important;
        }
        .campaign-brief-category {
          font-size: 22px !important;
        }
        .campaign-brief-list {
          margin-bottom: 26px !important;
          &:last-child {
            margin-bottom: 0 !important;
          }
          li {
            font-size: 18px !important;
          }
        }
      }
    }

    .campaign-details-style {
      .campaign-details-style-main {
        margin-left: 20px;
        margin-right: 20px;
        .campaign-details-style-title {
          font-size: 32px !important;
          padding: 34px 0 34px !important;
        }

        .campaigns-apply-btn-center {
          margin-bottom: 60px !important;
        }
      }
    }
  }
}
@media screen and (min-width: 750px) and (max-width: 899px) {
  .campaign-details-wrapper {
    padding: 15px;
    .campaign-details-top {
      padding-top: 15px !important;
      padding-bottom: 15px !important;
      .campaign-details-top-main {
        margin-left: 15px;
        margin-right: 15px;
        .campaign-details-top-img {

        }
      }
    }

    .campaign-details-intro {
      padding-top: 20px !important;
      padding-bottom: 20px !important;
      .campaign-details-intro-main {
        padding: 0 15px !important;
        margin-left: 15px;
        margin-right: 15px;
      }
      .campaign-details-data {
        &:first-child {
          padding-right: 20px;
        }
        &:last-child {
          padding-left: 20px;
        }
        .campaign-brief-subject {
          font-size: 26px !important;
          margin-bottom: 20px !important;
        }
        .campaign-brief-category {
          font-size: 20px !important;
        }
        .campaign-brief-list {
          margin-bottom: 22px !important;
          &:last-child {
            margin-bottom: 0 !important;
          }
          li {
            font-size: 16px !important;
          }
        }
      }
    }

    .campaign-details-style {
      .campaign-details-style-main {
        margin-left: 20px;
        margin-right: 20px;
        .campaign-details-style-title {
          font-size: 30px !important;
          padding: 26px 0 40px !important;
        }

        .campaigns-apply-btn-center {
          margin-bottom: 50px !important;
        }
      }
    }
  }
}
@media screen and (min-width: 640px) and (max-width: 749px) {
  .campaign-details-wrapper {
    padding: px2rem(15px);
    .campaign-details-top {
      padding-top: 15px !important;
      padding-bottom: 15px !important;
      .campaign-details-top-main {
        margin-left: 15px;
        margin-right: 15px;
      }
    }

    .campaign-details-intro {
      padding-top: 20px !important;
      padding-bottom: 20px !important;
      .campaign-details-intro-main {
        padding: 0 15px !important;
        margin-left: 15px;
        margin-right: 15px;
      }
      .campaign-details-data {
        &:first-child {
          padding-right: 20px;
        }
        &:last-child {
          padding-left: 20px;
        }
        .campaign-brief-subject {
          font-size: 26px !important;
          margin-bottom: 20px !important;
        }
        .campaign-brief-category {
          font-size: 20px !important;
        }
        .campaign-brief-list {
          margin-bottom: 22px !important;
          &:last-child {
            margin-bottom: 0 !important;
          }
          li {
            font-size: 16px !important;
          }
        }
      }
    }

    .campaign-details-style {
      .campaign-details-style-main {
        margin-left: 20px;
        margin-right: 20px;
        .campaign-details-style-title {
          font-size: 30px !important;
          padding: 30px 0 30px !important;
        }

        .campaigns-apply-btn-center {
          margin-bottom: 50px !important;
        }
      }
    }
  }
}
@media screen and (max-width: 639px) {
  .campaign-details-wrapper {
    padding: px2rem(15px);
    .campaign-details-top {
      padding-top: 15px !important;
      padding-bottom: 15px !important;
      .campaign-details-top-main {
        margin-left: 15px;
        margin-right: 15px;
      }
    }

    .campaign-details-intro {
      padding-top: 20px !important;
      padding-bottom: 20px !important;
      .campaign-details-intro-main {
        padding: 0 15px !important;
        margin-left: 0;
        margin-right: 0;
        border: none;
      }
      .campaign-details-data {
        &:first-child {
          padding-right: 20px;
        }
        &:last-child {
          padding-left: 20px;
        }
        .campaign-brief-subject {
          font-size: px2rem(36px) !important;
          margin-bottom: px2rem(30px) !important;
        }
        .campaign-brief-category {
          font-size: px2rem(32px) !important;
        }
        .campaign-brief-list {
          margin-bottom: px2rem(26px) !important;
          &:last-child {
            margin-bottom: 0 !important;
          }
          li {
            font-size: px2rem(26px) !important;
          }
        }
      }
    }

    .campaign-details-style {
      .campaign-details-style-main {
        margin-left: 15px;
        margin-right: 15px;
        .campaign-details-style-title {
          font-size: px2rem(40px) !important;
          padding: px2rem(40px) 0 px2rem(40px) !important;
        }

        .campaigns-apply-btn-center {
          margin-bottom: px2rem(40px) !important;
        }
      }
    }
  }
}

@media screen and (min-width: 900px) and (max-width: 1199px) {
  .campaign-details-wrapper {
    .campaigns-apply-btn {
      width: 300px;
      height: 60px;
      font-size: 22px;
    }
    .campaign-details-top {
      /*padding-top: 35px;
      padding-bottom: 35px;*/
      .campaign-details-top-main {
        /*padding-left: 30px;
        padding-right: 30px;*/
        .campaign-details-top-img {
          width: 48%;
        }
        .campaign-details-top-brief {
          width: 48%;
          .campaign-details-discount {
            font-size: 22px;
            margin-bottom: 15px;
          }
          .campaign-details-title {
            font-size: 36px;
            margin-bottom: 30px;
            line-height: 1.05;
          }
          .campaign-details-date {
            line-height: 1.3;
            margin-bottom: 10px;
          }
          .campaigns-days-left {
            line-height: 1.5;
            margin-bottom: 20px;
          }
        }
      }
    }

    .campaign-details-intro {
      padding-top: 35px;
      padding-bottom: 35px;
      .campaign-details-intro-main {
        padding-left: 30px;
        padding-right: 30px;
      }
      .campaign-details-data {
        .campaign-brief-subject {
          font-size: 34px;
          margin-bottom: 40px;
        }
        .campaign-brief-category {
          font-size: 24px;
        }
        .campaign-brief-list {
          margin-bottom: 36px;
          li {
            font-size: 22px;
            line-height: 1.4;
            &:before {
              margin-right: 8px;
            }
          }
        }
      }
    }

    .campaign-details-style {
      .campaign-details-style-main {
        /*padding-left: 30px;
        padding-right: 30px;*/

        .campaign-details-style-title {
          font-size: 44px;
          padding: 40px 0 60px;
        }
        .campaign-details-style-photos {
          margin-bottom: 70px;
          flex-wrap: wrap;
          li {
            width: 31%;
            margin-bottom: 36px;
          }
        }
        .campaigns-apply-btn-center {
          margin-bottom: 106px;
        }
      }
    }
  }
}

@media screen and (min-width: 640px) and (max-width: 899px) {
  .campaign-details-wrapper {
    .campaigns-apply-btn {
      width: 300px;
      height: 60px;
      font-size: 22px;
    }
    .campaign-details-top {
      /*padding-top: 25px;
      padding-bottom: 25px;*/
      .campaign-details-top-main {
        /*padding-left: 25px;
        padding-right: 25px;*/
        flex-direction: column;
        .campaign-details-top-img {
          width: 60%;
          margin-bottom: 30px;
          /*align-self: center;*/
        }
        .campaign-details-top-brief {
          width: 100%;
          .campaign-details-discount {
            font-size: 24px;
            margin-bottom: 20px;
          }
          .campaign-details-title {
            font-size: 40px;
            margin-bottom: 30px;
            line-height: 1.1;
          }
          .campaign-details-date {
            line-height: 1.3;
            margin-bottom: 10px;
            span {
              font-size: 20px;
            }
            strong {
              font-size: 24px;
            }
          }
          .campaigns-country {
            span {
              font-size: 16px;
            }
          }
          .campaigns-days-left {
            line-height: 1.5;
            margin-bottom: 20px;
          }
        }
      }
    }

    .campaign-details-intro {
      padding-top: 25px;
      padding-bottom: 25px;
      .campaign-details-intro-main {
        padding-left: 25px;
        padding-right: 25px;
      }
      .campaign-details-data {
        &:first-child {
          padding-right: 20px;
        }
        &:last-child {
          padding-left: 20px;
        }
        .campaign-brief-subject {
          font-size: 30px;
          margin-bottom: 30px;
        }
        .campaign-brief-category {
          font-size: 22px;
        }
        .campaign-brief-list {
          margin-bottom: 30px;
          li {
            font-size: 20px;
            line-height: 1.35;
            padding-left: 10px;
            &:before {
              width: 4px;
              height: 4px;
              margin-right: 6px;
              margin-left: -10px;
              top: -4px;
            }
          }
        }
      }
    }

    .campaign-details-style {
      .campaign-details-style-main {
        /*padding-left: 25px;
        padding-right: 25px;*/

        .campaign-details-style-title {
          font-size: 30px !important;
          padding: 30px 0 30px !important;
        }
        .campaign-details-style-photos {
          margin-bottom: 50px;
          flex-wrap: wrap;
          li {
            width: 48%;
            margin-bottom: 30px;
          }
        }
        .campaigns-apply-btn-center {
          margin-bottom: 100px;
        }
      }
    }
  }
}

@media screen and (max-width: 639px) {
  .campaign-details-wrapper {
    .campaigns-apply-btn {
      max-width: px2rem(640px);
      width: 100%;
      height: auto;
      padding-top: px2rem(24px);
      padding-bottom: px2rem(24px);
      font-size: px2rem(32px);
    }
    .campaign-details-top {
      /*padding-top: px2rem(45px);
      padding-bottom: px2rem(45px);*/

      .campaign-details-top-main {
        /*padding-left: px2rem(25px);*/
        /*padding-right: px2rem(25px);*/
        flex-direction: column;
        .campaign-details-top-img {
          width: 100%;
          margin-bottom: px2rem(30px);
          /*align-self: center;*/
        }
        .campaign-details-top-brief {
          width: 100%;
          .campaign-details-discount {
            font-size: px2rem(28px);
            margin-bottom: px2rem(20px);
          }
          .campaign-details-title {
            font-size: px2rem(44px);
            margin-bottom: px2rem(30px);
            line-height: 1.1;
          }
          .campaign-details-date {
            line-height: 1.3;
            margin-bottom: px2rem(10px);
            span {
              font-size: px2rem(24px);
            }
            strong {
              font-size: px2rem(28px);
            }
          }
          .campaigns-country {
            span {
              font-size: px2rem(24px);
            }
          }
          .campaigns-days-left {
            line-height: 1.5;
            margin-bottom: px2rem(20px);
            font-size: px2rem(24px);
            strong {
              font-size: px2rem(28px);
            }
          }
        }
      }
    }

    .campaign-details-intro {
      padding-top: px2rem(45px);
      padding-bottom: px2rem(45px);
      .campaign-details-intro-main {
        padding-left: px2rem(25px);
        padding-right: px2rem(25px);
        flex-direction: column;
        &:before {
          width: 0;
          overflow: hidden;
          display: none;
        }
      }
      .campaign-details-data {
        width: 100%;
        &:first-child {
          padding-right: 0;
          padding-bottom: px2rem(25px);
          margin-bottom: px2rem(25px);
          overflow: hidden;
          @include pr;
          &:after {
            content: "";
            @include pa;
            width: 100%;
            height: 1px;
            background-color: #dfdfdf;
            bottom: px2rem(2px);
            left: 0;
          }
        }
        &:last-child {
          padding-left: 0;
        }
        /*.campaign-brief-subject {
          font-size: px2rem(36px);
          margin-bottom: px2rem(40px);
        }*/
        /*.campaign-brief-category {
          font-size: px2rem(28px);
        }*/
        .campaign-brief-list {
          /*margin-bottom: px2rem(40px);*/
          &:last-child {
          }
          li {
            font-size: px2rem(24px);
            line-height: 1.35;
            padding-left: 10px;
            &:before {
              width: 4px;
              height: 4px;
              margin-right: 6px;
              margin-left: -10px;
              top: -4px;
            }
          }
        }
      }
    }

    .campaign-details-style {
      .campaign-details-style-main {
        /*padding-left: px2rem(25px);
        padding-right: px2rem(25px);*/

        /*.campaign-details-style-title {
          font-size: px2rem(40px) !important;
          padding: px2rem(30px) 0 px2rem(30px) !important;
        }*/
        .campaign-details-style-photos {
          margin-bottom: px2rem(50px);
          flex-direction: column;
          li {
            width: 100%;
            margin-bottom: px2rem(30px);
            &:hover {
              img {
                transform: scale(1.05) rotate(0deg);
              }
            }
          }
        }
        .campaigns-apply-btn-center {
          margin-bottom: px2rem(100px);
        }
      }
    }
  }
}
</style>
