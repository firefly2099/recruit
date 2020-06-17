import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import api from "../api";

const state = {
  winW: window.innerWidth, // 窗口宽度
  winH: document.documentElement.clientHeight, // 窗口高度
  isPlaying: false, // 背景音乐是否在播放
  loginStatus: 0, // 登录状态(0: 未知, 1：未登录, 2: 已登录)
  userInfo: {}, // 登录用户信息
  labels: {}, // 系统标签
  basicInformation: {}, //用户基本信息
  rates: {}, // 用户价格
  address: {}, // 地址
  payment: {}, // 支付信息
  social: {}, // 社交账号
  avatarPageStatus: false, // 头像页面状态
  message: {
    title: "",
    msg: "",
    code: 0, // 0:提示，1:警告, 2:成功
  }
};

const getters = {
  userName: state => {
    return state.userInfo.nickname || "";
  }
};

const actions = {
  /**
   * 检测是否登录
   * @param commit
   */
  checkLogin({ commit }) {
    return api.get("api.user/checkLogin")
      .then(res => { // success
        commit("setUserInfo", res.data);
        if (+res.code !== 1) {
          console.log("login failure:", res.info);
        }
        return res;
      });
  },

  /**
   * 注册
   * @param data
   * @returns {*|Promise<any>}
   */
  signUp({}, data) {
    return api.post("api.user/register", data);
  },

  /**
   * 联系我们
   * @param data
   * @returns {*|Promise<any>}
   */
  contact({}, data) {
    return api.post("api.message/leave", data);
  },

  /**
   * 登录
   * @param commit
   * @param data
   * @returns {Promise<T | never>}
   */
  signIn({ commit }, data) {
    return api.post("api.user/login", data)
      .then(res => {
        if (+res.code === 0) {
          commit("setUserInfo", res.data);
        }
        return res;
      });
  },

  /**
   * 重置密码
   * @param commit
   * @returns {*|Promise<any>}
   */
  resetPassword({}, data) {
    return api.post("api.user/changePassByCode", data);
  },

  /**
   * 发送验证码到邮箱
   * @param commit
   * @returns {*|Promise<any>}
   */
  sendCode({}, data) {
    return api.post("api.user/sendCode", data);
  },

  /**
   * 退出登录
   * @param commit
   * @returns {Promise<T | never>}
   */
  logout({ commit }) {
    return api.get("api.user/logout")
      .then(res => {
        if (+res.code === 1) {
          commit("setUserInfo", {});
        }
        return res;
      })
  },

  /**
   * 查询资料完整度
   * @returns {*|Promise<any>}
   */
  queryPerfect() {
    return api.get("api.user/perfectInfo");
  },

  /**
   * 查询用户基本信息
   * @param commit
   * @returns {Promise<T | never>}
   */
  queryProfile({ commit }) {
    return api.get("api.profile/one")
      .then(res => {
        if (+res.code === 1) {
          commit("setBasicInformation", res.data);
        }
        return res;
      });
  },

  /**
   * 修改资料
   * @param commit
   */
  modifyProfile({ }, data) {
    return api.post("api.profile/addOrUpdate", data);
  },

  /**
   * 查询系统标签
   * @param commit
   */
  queryLabel({ commit }) {
    return api.get("api.tag/index")
      .then(res => {
        if (+res.code === 1) {
          commit("setLabel", res.data);
        }
        return res;
      });
  },

  /**
   * 查询价格
   * @param commit
   * @returns {Promise<T | never>}
   */
  queryRates({ commit }) {
    return api.get("api.rate/one")
      .then(res => {
        if (+res.code === 1) {
          commit("setRates", res.data);
        }
        return res;
      });
  },

  /**
   * 修改价格
   * @param commit
   */
  modifyRates({ }, data) {
    return api.post("api.rate/addOrUpdate", data);
  },

  /**
   * 查询地址
   * @param commit
   * @returns {Promise<T | never>}
   */
  queryAddress({ commit }) {
    return api.get("api.address/one")
      .then(res => {
        if (+res.code === 1) {
          commit("setAddress", res.data);
        }
        return res;
      });
  },

  /**
   * 修改地址
   * @param commit
   */
  modifyAddress({ }, data) {
    return api.post("api.address/addOrUpdate", data);
  },

  /**
   * 查询支付信息
   * @param commit
   * @returns {Promise<T | never>}
   */
  queryPayment({ commit }) {
    return api.get("api.pay/one")
      .then(res => {
        if (+res.code === 1) {
          commit("setPayment", res.data);
        }
        return res;
      });
  },

  /**
   * 修改支付信息
   * @param commit
   */
  modifyPayment({ }, data) {
    return api.post("api.pay/addOrUpdate", data);
  },

  /**
   * 查询社交账号
   * @param commit
   * @returns {Promise<T | never>}
   */
  querySocial({ commit }) {
    return api.get("api.sns/one")
      .then(res => {
        if (+res.code === 1) {
          commit("setPayment", res.data);
        }
        return res;
      });
  },

  /**
   * 修改社交账号
   * @param commit
   */
  modifySocial({ }, data) {
    return api.post("api.sns/addOrUpdate", data);
  },

  /**
   * 修改密码
   * @param commit
   */
  modifyPassword({ }, data) {
    return api.post("api.user/changePass", data);
  },

  /**
   * 上传头像
   * @param data
   * @returns {*|Promise<any>}
   */
  uploadAvatar({ }, data) {
    return api.post("api.user/uploadImg", data);
  },

  /**
   * 清除数据
   * @param commit
   */
  clearUserInfo({ commit }) {
    commit("setUserInfo", {});
  },

  /**
   * 获取活动类型
   * @returns {*|Promise<any>}
   */
  queryCampaignTypes() {
    return api.get("api.campaign/type");
  },

  /**
   * 获取活动类型
   * @returns {*|Promise<any>}
   */
  queryCampaignList({ }, data) {
    return api.get("api.campaign/list", data);
  },

  /**
   * 获取活动类型
   * @returns {*|Promise<any>}
   */
  queryMyCampaigns({ }, data) {
    return api.get("api.campaign/my", data);
  },

  /**
   * 获取活动详情
   * @returns {*|Promise<any>}
   */
  queryCampaignDetail({ }, data) {
    return api.get("api.campaign/detail", data);
  },

  /**
   * 活动报名
   * @param data
   */
  campaignApply({ }, data) {
    return api.get("api.campaign/apply", data);
  }
};

const mutations = {
  /**
   * 页面大小
   * @param state
   * @param w
   * @param h
   */
  setPageWidth(state, { w, h }) {
    state.winW = w;
    state.winH = h;
  },

  /**
   * 登录用户信息
   * @param state
   * @param data
   */
  setUserInfo( state, data = {}) {
    data = data != null ? data : {};
    state.userInfo = data;
    console.info("Object.keys(data).length", Object.keys(data).length, data == null);
    if (Object.keys(data).length > 0) { // 已登录
      state.loginStatus = 2;
    } else { // 未登录
      state.loginStatus = 1;
    }
  },

  /**
   * 基本信息
   * @param state
   * @param data
   */
  setBasicInformation( state, data ) {
    state.basicInformation = data;
  },

  /**
   * 价格
   * @param state
   * @param data
   */
  setRates( state, data ) {
    console.log("setRates", !data);
    state.rates = !data ? {} : data;
  },

  /**
   * 系统标签
   * @param state
   * @param data
   */
  setLabel( state, data ) {
    state.labels = data;
  },

  /**
   * 地址
   * @param state
   * @param data
   */
  setAddress( state, data ) {
    state.address = data;
  },

  /**
   * 支付信息
   * @param state
   * @param data
   */
  setPayment( state, data ) {
    state.payment = data;
  },

  /**
   * 社交账号
   * @param state
   * @param data
   */
  setSocial( state, data ) {
    state.social = data;
  },

  // 上传头像页面显示状态
  setAvatarPageStatus( state, value) {
    state.avatarPageStatus = value;
  },

  // 设置头像
  setUserAvatar( state, val ) {
    state.userInfo.headimg = val;
  },

  // 设置错误信息
  setMessage( state, val) {
    state.message =  val;
    if (typeof state.message.title === "undefined") {
      state.message.title = "";
    }
  }
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});
