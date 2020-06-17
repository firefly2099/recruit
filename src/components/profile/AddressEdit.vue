<template>
  <section class="profile-edit-wrapper">
    <div class="profile-edit-content">
      <div class="system-tips" v-if="systemTips && systemTips !== 'loading'">{{ systemTips }}</div>
      <div class="profile-social-title">
        <h2>Delivery Address</h2>
        <p>Fill in your address for us to post product samples to you for campaigns.</p>
      </div>
      <form ref="shippingAddressForm" @submit.prevent="shippingAddressSubmit">
        <div class="profile-edit-datum">
          <label>Address</label>
          <input class="profile-edit-control" type="text" name="detail" v-model="address.detail">
        </div>
        <div class="profile-edit-datum">
          <label>Country</label>
          <select class="profile-edit-control" name="country" v-model="address.country" @change="chooseCountry">
            <option v-for="country of countries" :value="country.name" :key="country.code">{{ country.name }}</option>
          </select>
        </div>
        <div class="profile-edit-datum" v-if="statesData != null">
          <label>State</label>
          <!--<input class="profile-edit-control" type="text">-->
          <select class="profile-edit-control" name="state" v-model="address.state" @change="chooseState">
            <option v-for="state of states" :value="state.name" :key="state.code">{{ state.name }}</option>
          </select>
        </div>
        <div class="profile-edit-datum" v-if="citiesData != null">
          <label>City</label>
          <!--<input class="profile-edit-control" type="text">-->
          <select class="profile-edit-control" name="city" v-model="address.city">
            <option v-for="city of cities" :value="city.name" :key="city.code">{{ city.name }}</option>
          </select>
        </div>
        <div class="profile-edit-datum">
          <label>Postcode</label>
          <input class="profile-edit-control" type="tel" name="postcode" v-model="address.postcode">
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

import countriesData from "../../assets/js/countriesDataMixin";

export default {
  name: "AddressEdit",

  components: {
    Loading
  },

  props: ["systemTips", "address"],
  mixins: [ countriesData ],

  data() {
    return {
      error: {
        date: ""
      },
      formTips: "",
      isRefer: false,
      timer: null,
    };
  },

  computed: {
    initData() {
      return this.address;
    },
  },

  /*beforeRouteLeave(to, from, next) {
    // console.log("beforeRouteLeave:", to, from);
    // next();
  },*/

  methods: {
    /**
     * 提交地址
     */
    shippingAddressSubmit() {
      let params = new FormData(this.$refs.shippingAddressForm);
      // params.append("id", this.address.id);
      // params.append("city", this.address.city);
      // params.append("state", this.address.state);
      // params.append("country", this.address.country);
      // params.append("detail", this.address.detail);
      // params.append("postcode", this.address.postcode);

      if (this.address.id) {
        params.set("id", this.address.id);
      }

      this.isRefer = true;
      this.$store.dispatch("modifyAddress", params)
        .then(res => {
          if (+res.code === 1000) {
            return this.redirectSignIn();
          }

          if (+res.code === 1) {
            this.$parent.getPerfectInfo();
            this.$router.replace("/profile/address");
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
@import "../../assets/css/profile/address";
</style>
