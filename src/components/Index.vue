<template>
  <div>
    <Banner></Banner>
    <section class="index-influence" ref="influence" :class="{ show: this.level > 0 }">
      <div class="influence-box">
        <div class="influence-words">
          <h2>For Content Creators <br>with Influence and Passion</h2>
          <p>We love working with aspiring influencers to craft unique and beautiful content, be an advocate for brands or products you love and inspire your audience with your true voice.</p>
          <p>We value authenticity, creativity and relationships built over time. All you need to bring is your talent and creativity to receive exciting opportunities to shine.</p>
        </div>
        <div class="influence-picture">
          <img src="../assets/img/phone.png" alt="" width="100%">
        </div>
      </div>
    </section>

    <section class="index-model" ref="model" :class="{ show: this.level > 1 }">
      <div class="index-model-box">
        <ul class="index-model-list">
          <li>
            <div class="index-model-list-picture">
              <img src="../assets/img/model-1.jpg" alt="" width="100%">
            </div>
          </li>
          <li>
            <div class="index-model-list-picture">
              <img src="../assets/img/model-2.jpg" alt="" width="100%">
            </div>
          </li>
          <li>
            <div class="index-model-list-picture">
              <img src="../assets/img/model-3.jpg" alt="" width="100%">
            </div>
          </li>
          <li>
            <div class="index-model-list-picture">
              <img src="../assets/img/model-4.jpg" alt="" width="100%">
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section class="index-join" ref="join" :class="{ show: this.level > 2 }">
      <div class="index-join-content">
        <h2 class="index-join-title">JOIN ONLIVE CLUB</h2>
        <ul class="index-join-intro">
          <li>
            <h5>Exciting Opportunities in <br>a New Era of Marketing</h5>
            <p>Onlive Club connects talented influencers like You with brands and advertisers. We provide sponsorship opportunities for you to create and share amazing content on your social media channels. </p>
          </li>
          <li>
            <h5>Be an Advocate for the <br>Brands & Products You Love</h5>
            <p>Receive great products, invitations to special events, exclusive collaboration opportunities and perks. <br>Be in the Club and become an ambassador. <br>Let’s thrive together!</p>
          </li>
          <li>
            <h5>Grow with Us & Get Paid on Time</h5>
            <p>We value hard work, high quality content and reliable relationships. Whether you have 8 thousand or 8 million followers, you are important to us. Just have fun doing what you love, enjoy all the benefits of being in the Club and receive prompt payments. </p>
          </li>
        </ul>
        <div class="index-join-link">
          <router-link to="/signUp" class="index-join-sign-up" v-if="loginStatus !== 2">JOIN THE CLUB</router-link>
          <router-link to="/" class="index-join-how" style="display: none;">or see how it works</router-link>
        </div>
      </div>
    </section>

    <section class="index-voices" ref="voices" :class="{ show: this.level > 3 }">
      <div class="index-voices-content">
        <h2 class="index-voices-title">THEIR VOICES</h2>
        <div class="index-voices-box">
          <div class="index-voices-video">
            <img src="../assets/img/poster-1.jpg" alt="" width="100%">
          </div>
          <div class="index-voices-text">
            <strong><img src="../assets/img/quot.png" alt="" width="100%"></strong>
            <p>I had an amazing opportunity to be paired with one of the hottest fashion brands and be part of an exclusive live show. Onlive club provided full support and know-how.<br>It was so much fun! “</p>
            <span>Instagram Influencer @Flaverala</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Banner from "../components/Banner";

import { mapState } from "vuex";

export default {
  name: "Index",
  components: {
    Banner
  },

  data() {
    return {
      scrollTop: 0,
      level: 0,
    };
  },

  computed: {
    ...mapState(["winW", "winH", "loginStatus"]),
  },

  activated() {
    console.log("Home activated...");
  },

  mounted() {
    this.scrollTop = 0;
    // window.addEventListener("scroll", this.scroll, false);
  },

  methods: {
    scroll() {
      console.log("scroll...");
      this.scrollTop = document.documentElement.scrollTop;

      let influence = this.$refs.influence.getBoundingClientRect();
      if (this.winH > influence.top + 40) {
        this.level = 1;
      }

      let model = this.$refs.model.getBoundingClientRect();
      if ((this.winH) > (model.top + 40)) {
        this.level = 2;
      }

      let join = this.$refs.join.getBoundingClientRect();
      if ((this.winH) > (join.top + 40)) {
        this.level = 3;
      }

      let voices = this.$refs.voices.getBoundingClientRect();
      if ((this.winH) > (voices.top + 40)) {
        this.level = 4;
      }
    }
  },

  beforeRouteEnter(to, from, next) {
    console.log("beforeRouteEnter...");
    next(vm => {
      vm.$parent.getPageSize();
      vm.scroll();
      window.addEventListener("scroll", vm.scroll, false);
    });
  },

  beforeRouteLeave(to, from, next) {
    window.removeEventListener("scroll", this.scroll, false);
    console.log("beforeRouteLeave...");
    document.documentElement.scrollTop = 0;
    this.scrollTop = 0;
    this.level = 0;
    next();
  }
};
</script>

<style lang="scss" scoped>

</style>
<style lang="scss">
@import "../assets/css/index";
</style>
