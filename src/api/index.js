import axios from "axios";
// require("es6-promise").polyfill();

// 全局配置
axios.defaults.timeout = 10000; // 超时时间
axios.defaults.baseURL = "/public/club/"; // api根地址

export default {
  /**
   * get 方式
   * @param url
   * @param data
   * @returns {Promise<any>}
   */
  get(url, param) {
    return axios
      .get(url, {
        params: param
      })
      .then(res => res.data);
  },

  /**
   * post 方式
   * @param url
   * @param data
   * @returns {Promise<any>}
   */
  post(url, param) {
    return axios
      .post(url, param, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      })
      .then(res => res.data);
  }
};
