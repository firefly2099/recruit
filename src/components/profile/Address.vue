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
          <template v-if="systemTips != 'loading'">
            <template v-if="!Object.keys(address).length">
              <div class="profile-info">No address added.</div>
            </template>
            <template v-else>
              <div class="profile-edit-datum">
                <label>Address</label>
                <div class="profile-info profile-border">
                  {{ address.detail }}
                </div>
              </div>
              <div class="profile-edit-datum" v-if="address.country">
                <label>Country</label>
                <div class="profile-info profile-border">
                  {{ address.country }}
                </div>
              </div>
              <div class="profile-edit-datum" v-if="address.state">
                <label>State</label>
                <div class="profile-info profile-border">
                  {{ address.state }}
                </div>
              </div>
              <div class="profile-edit-datum" v-if="address.city">
                <label>City</label>
                <div class="profile-info profile-border">
                  {{ address.city }}
                </div>
              </div>
              <div class="profile-edit-datum" v-if="address.postcode">
                <label>Postcode</label>
                <div class="profile-info profile-border">
                  {{ address.postcode }}
                </div>
              </div>
            </template>
          </template>
        </div>
        <div class="info-tips">{{ formTips }}</div>
        <template v-if="systemTips != 'loading'">
          <router-link class="info-sub profile-edit-btn" to="/profile/address/edit">
            <template v-if="!Object.keys(address).length">
              Add
            </template>
            <template v-else>
              Edit
            </template>
          </router-link>
        </template>
      </form>
    </div>
  </section>
</template>

<script>
export default {
  name: "Address",

  components: {
  },

  props: ["systemTips", "address"],

  data() {
    return {
      error: {
        date: ""
      },
      formTips: "",
      isRefer: false,
    };
  },

  methods: {
    chooseDate(e) {
      let date = new Date(e);
      // console.log('chooseDate', date.getMonth(), date.getDate(), date.getFullYear());
      if (isNaN(date.getDate())) {
        // this.date = "";
        this.error.date = "Invalid Date";
      } else {
        // let d = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        // this.date = d.toString() + "/" + (date.getDate() < 10 ? ('0' + (date.getDate() + 1)) : date.getDate()).toString() + "/" + date.getFullYear();
        this.error.date = "";
      }
    },

    shippingAddressSubmit() {

    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/profile/address";
</style>
