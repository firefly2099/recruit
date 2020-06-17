<template>
  <section class="profile-edit-wrapper">
    <div class="profile-edit-content">
      <div class="system-tips" v-if="systemTips && systemTips !== 'loading'">{{ systemTips }}</div>
      <form ref="profileEditForm">
        <div class="profile-edit-datum">
          <label>Full Name</label>
          <div class="profile-info profile-border">{{ info.full_name }}</div>
        </div>
        <div class="profile-edit-datum">
          <label>Social Name</label>
          <div class="profile-info profile-border">{{ info.social_name }}</div>
        </div>
        <div class="profile-edit-datum">
          <label>Gender</label>
          <div class="profile-info profile-border">{{ info.gender }}</div>
        </div>
        <div class="profile-edit-datum">
          <label>Birthday</label>
          <div class="profile-info profile-border">{{ info.birth }}</div>
        </div>
        <div class="profile-edit-datum">
          <label>Phone Number</label>
          <div class="profile-info profile-border">{{ info.phone }}</div>
        </div>
        <div class="profile-edit-datum">
          <label>Primary Language</label>
          <div class="profile-info profile-border">{{ info.lang }}</div>
        </div>
        <div class="profile-edit-datum">
          <label>Occupation</label>
          <div class="profile-info profile-border">{{ info.occupation }}</div>
        </div>
        <div class="profile-edit-datum">
          <label>Race/Ethnicity</label>
          <div class="profile-info profile-border">{{ info.race }}</div>
        </div>
        <div class="profile-edit-datums">
          <div class="profile-edit-datum">
            <label>Height</label>
            <div class="profile-info profile-border">{{ info.height }}</div>
          </div>
          <div class="profile-edit-datum">
            <label>Chest</label>
            <div class="profile-info profile-border">{{ info.bust }}</div>
          </div>
          <div class="profile-edit-datum">
            <label>Hips</label>
            <div class="profile-info profile-border">{{ info.hips }}</div>
          </div>
          <div class="profile-edit-datum">
            <label>Waist</label>
            <div class="profile-info profile-border">{{ info.waist }}</div>
          </div>
          <div class="profile-edit-datum">
            <label>Shoe Size</label>
            <div class="profile-info profile-border">{{ info.shoe_size }}</div>
          </div>
        </div>
        <div class="profile-edit-datum">
          <label>Bio</label>
          <div class="profile-info profile-border" style="height: auto; min-height: 30px; line-height: 1.5;">{{ info.bio }}</div>
        </div>
        <div class="profile-edit-datum">
          <label>Label</label>
          <div class="profile-edit-labels">
            <span v-for="(label, index) of info.tag" :key="index" class="checked">{{ label.name }}</span>
          </div>
        </div>
        <div class="profile-edit-datum">
          <label>My works</label>
          <div class="profile-files">
            <template v-for="url of info.url">
              <div v-if="url" :key="url" class="profile-file">
                <!--<img :src="url" alt="">-->
                <template v-if="url.match(/.mp4$/i)">
                  <video :src="url" alt="" width="100%" height="100%" controls></video>
                </template>
                <template v-else>
                  <img :src="url" alt="">
                </template>
              </div>
            </template>
          </div>
          <!--<div class="profile-info">
            <img v-for="(url, index) of info.url" :src="url" alt="" :key="index">
          </div>-->
        </div>
        <div class="info-tips"></div>
        <router-link class="info-sub profile-edit-btn" to="/profile/info/edit">Edit</router-link>
      </form>
    </div>
  </section>
</template>

<script>
// import _ from "lodash";

import { mapState } from "vuex";

export default {
  name: "Info",

  props: ["systemTips", "info"],

  ready() {
    console.log("info ready...");
  },

  activated() {
    console.log("info activated...");
  },

  deactivated() {
    console.log("info deactivated...");
  },

  data() {
    return {
      error: {
        date: ""
      },
      formTips: "",
      isRefer: false,
      customLabels: [],
      // info: {},
    };
  },

  computed: {
    ...mapState(["basicInformation", "labels"])
  },

  created() {
  },

  filters: {
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

    /**
     * copy基本信息
     */
    /*copyInformation() {
      // Object.assign(this.$data.info, this.basicInformation);
      this.info = _.cloneDeep(this.basicInformation);
    }*/
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/profile/info";
</style>

<style lang="scss">
@import "../../assets/css/common";

.fa-calendar {
  background: url("../../assets/img/icon-calendar.png") 10px center no-repeat;
  padding-left: 40px;
}

@media screen and (min-width: 641px) and (max-width: 750px) {
  .fa-calendar {
    background-size: 20px 20px;
    background-position: 5px center;
    padding-left: 30px;
  }
}
</style>
