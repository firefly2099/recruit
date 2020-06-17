<template>
  <section class="campaigns-wrapper">
    <div class="campaigns-content">
      <div class="campaigns-title">
        <h2 class="headline">Campaigns for Application</h2>
        <p class="subtitle">Discover which campaigns are the right fit for you and your audience.</p>
      </div>
      <div class="campaigns-selection-wrapper">
        <select class="campaigns-selection" @change="changeCampaignType" v-model="currentType">
          <option value="">comprehensive</option>
          <option v-for="type of types" :key="type.id" :value="type.id">{{ type.name }}</option>
        </select>
        <nav class="campaigns-status-list" v-if="isMyCampaign">
          <a :class="{ checked: $route.query.status == 1 }" @click="queryCampaignsByStatus(1)">Reviewing</a>
          <a :class="{ checked: $route.query.status == 2 }" @click="queryCampaignsByStatus(2)">Confirmed</a>
          <a :class="{ checked: $route.query.status != 1 && $route.query.status != 2 }" @click="queryCampaignsByStatus()">ALL I APPLIED</a>
        </nav>
      </div>

      <div class="campaigns-box">
        <template v-if="isLoading">
          <Loading :color="'black'" style="margin-top: 50px;"></Loading>
        </template>
        <template v-else>
          <template v-if="Array.isArray(campaigns) && campaigns.length > 0">
            <ul class="campaigns-list" ref="campaignList" @click="campaignDetail">
              <li class="campaigns-item" v-for="campaign of campaigns" :key="campaign.id" :data-id="campaign.id">
                <a to="campaigns/details">
                  <div class="campaigns-img" v-set-img-height>
                    <img :src="campaign.local_url" alt="">
                    <!--<img src="../../assets/img/campaign.jpg" alt="">-->
                    <p class="campaign-status" v-if="isMyCampaign" :class="`campaign-status-${campaign.status}`">{{ campaign.status | statusToWords }}</p>
                  </div>
                  <div class="campaigns-intro">
                    <div class="campaigns-brand">{{ campaign.brand }}</div>
                    <div class="campaigns-name">{{ campaign.campaign_name }}</div>
                  </div>
                  <div class="campaigns-info">
                    <div class="campaigns-country">
                      <span>{{ campaign.name }}</span>
                      <img :src="campaign.flag_url" :alt="campaign.name">
                      <!--<img src="../../assets/img/flag.png" :alt="campaign.name">-->
                    </div>
                    <div class="campaigns-days-left">
                      <strong v-date-diff="{ start: campaign.start_time, end: campaign.end_time }"></strong> days left to apply
                    </div>
                  </div>
                </a>
              </li>
            </ul>
            <div class="pagination-wrap">
              <Paginate :page-count="page.pageCount" :value="page.currentPage" prev-text="Prev" next-text="Next" :container-class="'pagination'" :page-class="'page-item'" prev-class="page-item" next-class="page-item" page-link-class="page-link" prev-link-class="page-link" next-link-class="page-link" :click-handler="pageFlip"></Paginate>
            </div>
          </template>
          <template v-else>
            <div style="text-align: center; padding-top: 80px; font-size: 24px;">No data found.</div>
          </template>
        </template>
      </div>
    </div>
  </section>
</template>

<script>
import Loading from "../Loading";
import Paginate from "vuejs-paginate";
import campaignMixin from "../../assets/js/campaignMixin";

import { mapState } from "vuex";

export default {
  name: "Campaigns",

  mixins: [ campaignMixin ],

  components: {
    Loading,
    Paginate
  },

  data() {
    return {
      types: null,
      campaigns: null,
      isLoading: true,
      errorTips: "",
      page: {
        currentPage: 0,
        pageSize: 0,
        total: 0,
        pageCount: 0
      },
      currentType: "",
      timer: null,
      isMyCampaign: false
    };
  },

  computed: {
    ...mapState(["userInfo", "loginStatus"])
  },

  created() {
    this.getCampaignTypes();
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log("line 98 beforeRouteEnter...", to, from);
      vm.page.currentPage = to.query.page || 1;
      vm.currentType = to.params.id || "";
      vm.page.pageSize = to.query.pagesize || 20;

      if (vm.loginStatus === 0) {
        let loginTimer = setInterval(() => {
          if (vm.loginStatus !== 0) {
            clearInterval(loginTimer);
            vm.loginIntercept(to, vm.loginStatus);
          }
        }, 17);
      } else {
        vm.loginIntercept(to, vm.loginStatus);
      }
    });
  },

  beforeRouteUpdate(to, from, next) {
    console.log("line 111 beforeRouteUpdate...", to, from);
    this.page.currentPage = to.query.page || 1;
    this.page.pageSize = to.query.pagesize || 20;
    this.getCampaignList(to.path, to.query);
    next();
  },

  directives: {
    // 设置图片外框高度
    setImgHeight(el) {
      setTimeout(() => {
        let ele = window.getComputedStyle(el, null);
        el.style.height = ele.width;
      }, 0);
    }
  },

  mounted() {
    window.addEventListener("resize", this.resetImgHeight, false);
  },

  methods: {
    /**
     * 接口拦截(检测是否登录)
     */
    loginIntercept(to, loginStatus) {
      if (loginStatus === 2) { // 登录
        this.getCampaignList(to.path, to.query);
      }
    },

    /**
     * resize事件执行时重置图片大小
     */
    resetImgHeight() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        let campaignImgEle = this.$refs.campaignList.querySelectorAll(".campaigns-img");
        for (let ele of Array.from(campaignImgEle)) {
          ele.style.height = ele.clientWidth + "px";
        }
      }, 150);
    },

    /**
     * 获取活动类型
     */
    getCampaignTypes() {
      this.$store.dispatch("queryCampaignTypes")
        .then(res => {
          if (+res.code === 1) {
            this.types = res.data;
          } else {
            return Promise.reject(res.info || res.message);
          }
        })
        .catch(e => {
          console.log(JSON.stringify(e));
        });
    },

    /**
     * 获取活动列表
     */
    getCampaignList(path, query) {
      console.info("path:", path);
      this.isLoading = true;

      this.isMyCampaign = !!path.match(/^\/myCampaigns/);

      let data = {};
      data.campaign_type_id = this.currentType;
      data.page = this.page.currentPage;
      data.size = this.page.pageSize;
      if (this.isMyCampaign && query.status) {
        data.status = query.status;
      }

      let list = this.isMyCampaign ? this.$store.dispatch("queryMyCampaigns", data) : this.$store.dispatch("queryCampaignList", data);

      list.then(res => {
        if (+res.code === 1000) {
          return this.redirectSignIn();
        }

        if (+res.code === 1) {
          this.page.pageCount = res.data.last_page; // 总页数
          this.page.currentPage = res.data.current_page;
          this.page.pageSize = res.data.per_page;
          this.page.total = res.data.total;

          this.campaigns = res.data.data;
        } else {
          return Promise.reject(res.info || res.message);
        }

        this.isLoading = false;
        return true;
      }).then(() => {
        let val = this.campaigns.length > 0 ? 0 : 1;
        this.proxyVue.$emit("routeChange", val);
      }).catch(e => {
        this.proxyVue.$emit("routeChange", 0);
        this.isLoading = false;
        console.log(JSON.stringify(e));
      });
    },

    /**
     * 翻页
     */
    pageFlip(val) {
      console.info("val:", val);
      this.page.currentPage = val;
      let base = this.isMyCampaign ? "myCampaigns" : "campaigns";
      let query = { page: this.page.currentPage, pagesize: this.page.pageSize };
      if (this.isMyCampaign && this.$route.query.status) {
        query.status = this.$route.query.status;
      }
      this.$router.push({ path: `/${base}/${this.currentType}`, query: query });
      // this.getCampaignList();
    },

    /**
     * 查询活动列表
     */
    queryCampaignsByStatus(status) {
      console.log("status:", status);
      let base = this.isMyCampaign ? "myCampaigns" : "campaigns";
      let query = { page: this.page.currentPage, pagesize: this.page.pageSize };
      query.status = status;
      this.$router.push({ path: `/${base}/${this.currentType}`, query: query });
    },

    /**
     * 切换活动类型
     */
    changeCampaignType(e) {
      let id = e.target.value;
      console.info("id:", this.currentType, id);
      setTimeout(() => {
        let base = this.isMyCampaign ? "myCampaigns" : "campaigns";
        this.$router.push({ path: `/${base}/${id}`, query: { page: this.page.currentPage, pagesize: this.page.pageSize } });
      }, 0);
    },

    /**
     * 查询活动详情
     * @param e
     */
    campaignDetail(e) {
      if (e.target === e.currentTarget) { return false; }
      console.info("e.target.dataset.id:", e.target, e.target.tagName);
      let _target = (function getParent (ev) {
        if (ev.tagName.toLowerCase() === "li") {
          return ev;
        } else {
          return getParent(ev.parentElement);
        }
      })(e.target);

      this.$router.push({ name: "campaign_details", params: { id: _target.dataset.id } });
    }
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.resetImgHeight, false);
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";

.campaigns-wrapper {
  padding: 35px;
  background-color: #f0f0f0;

  .campaigns-content {
    background-color: #fff;
    padding: 30px 30px;

    .campaigns-title {
      margin-bottom: 35px;
      .headline {
        color: #070707;
        font-size: 44px;
        text-transform: uppercase;
        line-height: 1.3;
      }
      .subtitle {
        color: #757575;
        font-size: 30px;
        line-height: 1.3;
        font-family: VegurEL;
        font-weight: 600;
      }
    }

    .campaigns-selection-wrapper {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 30px;
      align-items: center;
    }
    .campaigns-selection {
      font-size: 20px;
      font-family: VegurEL;
      padding: 0 5px;
      border: 1px solid #b9b9b9;
      height: 36px;
      width: 170px;
      box-sizing: border-box;
      margin-right: 30px;
      background: none;
    }
    .campaigns-status-list {
      display: flex;
      a {
        margin: 0 20px;
        font-size: 20px;
        font-family: VegurR;
        color: #070707;
        cursor: pointer;
        &.checked {
          color: #f0143c;
          text-decoration: underline;
          text-underline-position: under;
        }
        &:hover {
          color: #f0143c;
        }
      }
    }

    .campaigns-box {
      width: 100%;
      height: auto;
      overflow-x: visible;
      min-height: 200px;

      .campaigns-list {
        display: flex;
        width: calc(100% + 30px);
        justify-content: flex-start;
        flex-wrap: wrap;
        .campaigns-item {
          @include pr;
          width: calc(25% - 30px);
          margin-right: 30px;
          margin-bottom: 30px;
          background-color: #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
          transition: box-shadow 0.35s;

          &:hover {
            box-shadow: 0 2px 5px 2px rgba(0, 0, 0, 0.5);
            z-index: 1;
          }

          a {
            display: block;
            cursor: pointer;
          }

          .campaigns-img {
            width: 100%;
            overflow: hidden;
            background-color: #f8f8f8;
            display: flex;
            align-items: center;
            @include pr;
            img {
              width: 100%;
              max-width: 100%;
            }
            .campaign-status {
              @include pa;
              width: 100%;
              left: 0;
              bottom: 0;
              text-align: center;
              background-color: rgba(0, 0, 0, 0.35);
              color: #fff;
              font-size: 16px;
              padding: 2px 0;
              font-family: "VegurEL";
            }
            /*.campaign-status-1 {
              color: #e21338;
            }
            .campaign-status-2 {
              color: #bddc93;
            }*/
          }
          .campaigns-intro {
            padding: 12px 0;
            margin: 0 10px;
            font-weight: 600;
            color: #070707;
            line-height: 1.35;
            border-bottom: 1px solid #dfdfdf;
            .campaigns-brand {
              font-size: 28px;
              font-family: VegurB;
            }
            .campaigns-name {
              font-size: 22px;
              font-family: VegurR;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }

          .campaigns-info {
            margin: 0 10px;
            display: flex;
            justify-content: space-between;
            padding: 20px 0;
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
    }
  }
}

@media screen and (min-width: 1400px) and (max-width: 1599px) {
  .campaigns-wrapper {
    padding: 30px;

    .campaigns-content {
      .campaigns-title {
        margin-bottom: 30px;
        .headline {
          font-size: 40px;
        }
        .subtitle {
          font-size: 27px;
        }
      }
      .campaigns-selection-wrapper {
        margin-bottom: 28px;
      }
      .campaigns-selection {

      }
      .campaigns-box {
        .campaigns-list {
          .campaigns-item {
            .campaigns-intro {
              padding: 10px 0;
              .campaigns-brand {
                font-size: 24px;
              }
              .campaigns-name {
                font-size: 18px;
              }
            }
            .campaigns-info {
              padding: 16px 0;
            }
          }
        }
      }
    }
  }
}

@media screen and (min-width: 1280px) and (max-width: 1399px) {
  .campaigns-wrapper {
    padding: 20px;

    .campaigns-content {
      .campaigns-title {
        margin-bottom: 30px;
        .headline {
          font-size: 36px;
        }
        .subtitle {
          font-size: 24px;
        }
      }
      .campaigns-selection-wrapper {
        margin-bottom: 28px;
      }
      .campaigns-box {
        .campaigns-list {
          .campaigns-item {
            .campaigns-intro {
              padding: 8px 0;
              margin-right: 8px;
              margin-left: 8px;
              .campaigns-brand {
                font-size: 23px;
              }
              .campaigns-name {
                font-size: 17px;
              }
            }
            .campaigns-info {
              padding: 12px 0;
              margin-left: 8px;
              margin-right: 8px;
            }
          }
        }
      }
    }
  }
}

@media screen and (min-width: 900px) and (max-width: 1279px) {
  .campaigns-wrapper {
    padding: 20px;

    .campaigns-content {
      padding: 20px;
      .campaigns-title {
        margin-bottom: 20px;
        .headline {
          font-size: 32px;
        }
        .subtitle {
          font-size: 22px;
        }
      }
      .campaigns-selection-wrapper {
        margin-bottom: 20px;
      }
      .campaigns-box {
        .campaigns-list {
          .campaigns-item {
            width: calc(33.3% - 30px);
            .campaigns-intro {
              padding: 8px 0;
              margin-right: 8px;
              margin-left: 8px;
              .campaigns-brand {
                font-size: 23px;
              }
              .campaigns-name {
                font-size: 17px;
              }
            }
            .campaigns-info {
              padding: 12px 0;
              margin-left: 8px;
              margin-right: 8px;
            }
          }
        }
      }
    }
  }

  .pagination-wrap {
    padding: 10px;
  }
}

@media screen and (min-width: 750px) and (max-width: 899px) {
  .campaigns-wrapper {
    padding: 15px;

    .campaigns-content {
      padding: 20px;
      .campaigns-title {
        margin-bottom: 18px;
        .headline {
          font-size: 30px;
        }
        .subtitle {
          font-size: 20px;
        }
      }
      .campaigns-selection-wrapper {
        margin-bottom: 18px;
      }
      .campaigns-box {
        .campaigns-list {
          width: calc(100% + 20px);
          .campaigns-item {
            width: calc(33.3% - 20px);
            margin-right: 20px;
            margin-bottom: 20px;
            .campaigns-intro {
              padding: 5px 0;
              margin-right: 4px;
              margin-left: 4px;
              .campaigns-brand {
                font-size: 22px;
              }
              .campaigns-name {
                font-size: 16px;
              }
            }
            .campaigns-info {
              padding: 8px 0;
              margin-right: 4px;
              margin-left: 4px;
              .campaigns-country {
                span {
                  font-size: 14px;
                }
              }
              .campaigns-days-left {
                font-size: 14px;
                strong {
                  font-size: 16px;
                }
              }
            }
          }
        }
      }
    }
  }

  .pagination-wrap {
    padding: 8px;
  }
}

@media screen and (min-width: 640px) and (max-width: 749px) {
  .campaigns-wrapper {
    padding: 15px;

    .campaigns-content {
      padding: 15px;
      .campaigns-title {
        margin-bottom: 18px;
        .headline {
          font-size: 28px;
        }
        .subtitle {
          font-size: 20px;
        }
      }
      .campaigns-selection-wrapper {
        margin-bottom: px2rem(32px);
      }
      .campaigns-selection {
        font-size: 16px;
        width: 140px;
        height: 30px;
        margin-right: 20px;
      }
      .campaigns-status-list a {
        margin: 15px;
        font-size: 18px;
      }
      .campaigns-box {
        .campaigns-list {
          width: calc(100% + 20px);
          .campaigns-item {
            width: calc(50% - 20px);
            margin-right: 20px;
            margin-bottom: 25px;
            .campaigns-intro {
              padding: 5px 0;
              margin-right: 4px;
              margin-left: 4px;
              .campaigns-brand {
                font-size: 20px;
              }
              .campaigns-name {
                font-size: 16px;
              }
            }
            .campaigns-info {
              padding: px2rem(10px) 0;
              margin-right: 4px;
              margin-left: 4px;
              .campaigns-country {
                span {
                  font-size: 14px;
                }
                img {
                  width: px2rem(24px);
                }
              }
              .campaigns-days-left {
                font-size: 16px;
                strong {
                  font-size: 18px;
                }
              }
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 639px) {
  .campaigns-wrapper {
    padding: px2rem(15px);

    .campaigns-content {
      padding: px2rem(15px) px2rem(15px);
      .campaigns-title {
        margin-bottom: px2rem(30px);
        .headline {
          font-size: px2rem(42px);
        }
        .subtitle {
          font-size: px2rem(28px);
        }
      }
      .campaigns-selection-wrapper {
        margin-bottom: 20px;
      }
      .campaigns-selection {
        font-size: 16px;
        width: 120px;
        height: 30px;
        padding: 0;
      }
      .campaigns-status-list a {
        margin: 10px 15px 0;
        font-size: 18px;
        &:first-child {
          margin-left: 0;
        }
      }
      .campaigns-box {
        .campaigns-list {
          width: calc(100% + 10px);
          .campaigns-item {
            width: calc(50% - 10px);
            margin-right: 10px;
            margin-bottom: 15px;
            .campaigns-intro {
              padding: px2rem(6px) 0 px2rem(4px);
              margin-right: 4px;
              margin-left: 4px;
              .campaigns-brand {
                font-size: px2rem(28px);
              }
              .campaigns-name {
                font-size: px2rem(22px);
              }
            }
            .campaigns-info {
              padding: px2rem(10px) 0;
              margin-right: 4px;
              margin-left: 4px;
              .campaigns-country {
                span {
                  font-size: px2rem(20px);
                  max-width: 50px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  margin-right: 2px;
                }
                img {
                  width: px2rem(24px);
                }
              }
              .campaigns-days-left {
                font-size: px2rem(20px);
                text-align: right;
                strong {
                  font-size: px2rem(24px);
                }
              }
            }
          }
        }
      }
    }
  }

  .pagination-wrap {
    padding: px2rem(24px);
  }
}
</style>

<style lang="scss">
.pagination-wrap {
  padding: 20px;
}
.pagination {
  display: flex;
  justify-content: center;
  padding-left: 0;
  list-style: none;
  border-radius: .25rem;
  /*margin-top: .5rem;
  margin-bottom: .5rem;*/

  .page-item {
    .page-link {
      position: relative;
      display: block;
      padding: .13rem .25rem;
      margin-left: -1px;
      line-height: 1.25;
      color: #757575;
      background-color: #fff;
      border: 1px solid #dee2e6;
      font-size: 0.3rem;
      font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
    }

    &:first-child {
      .page-link {
        margin-left: 0;
        border-top-left-radius: .1rem;
        border-bottom-left-radius: .1rem;
      }
    }

    &:last-child {
      .page-link {
        border-top-right-radius: .1rem;
        border-bottom-right-radius: .1rem;
      }
    }

    &.active {
      .page-link {
        color: #fff;
        background-color: #f0143c;
        border-color: #f0143c;
        position: relative;
        z-index: 1;
      }
    }

    &.disabled {
      .page-link {
        color: #6c757d;
        pointer-events: none;
        cursor: auto;
        background-color: #fff;
        border-color: #dee2e6;
      }
    }
  }

}
</style>
