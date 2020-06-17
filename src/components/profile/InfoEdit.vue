<template>
  <section class="profile-edit-wrapper">
    <div class="profile-edit-content">
      <div class="system-tips" v-if="systemTips && systemTips !== 'loading'">{{ systemTips }}</div>
      <form ref="profileEditForm" @submit.prevent="editProfileSubmit">
        <div class="profile-edit-datum">
          <label>Full Name</label>
          <input class="profile-edit-control" type="text" name="full_name" v-model="info.full_name">
        </div>
        <div class="profile-edit-datum">
          <label>Social Name</label>
          <input class="profile-edit-control" type="text" name="social_name" v-model="info.social_name">
        </div>
        <div class="profile-edit-datum">
          <label>Gender</label>
          <select class="profile-edit-control" name="gender" v-model="info.gender">
            <option value="" disabled>Select one</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="profile-edit-datum">
          <label>Birthday</label>
          <Datepicker placeholder="" :value="info.birth" valueType="format" calendar-button-icon="fa fa-calendar" input-class="signup-form-control fa-calendar" type="date" format="MM/dd/yyyy" name="birth" required @input="chooseDate">
            <div slot="afterDateInput" class="signup-validate" :class="{ 'has-error': errors.date }">
              <span class="signup-control-tips">{{ errors.date }}</span>
            </div>
          </Datepicker>
        </div>
        <div class="profile-edit-datum">
          <label>Primary Language</label>
          <div class="profile-edit-control-wrap">
            <input class="profile-edit-control" :class="{ 'has-error': errors.lang }" type="text" name="lang" ref="lang" v-model="info.lang" @focus="showLanguages" @blur="hideLanguage" @input="clearError('lang')" autocomplete="off">
            <ul class="languages-list" v-show="languagesVisible" @click="changeLanguage">
              <template v-if="languagesBySearch.length">
                <li v-for="(language, index) of languagesBySearch" :key="index" :data-code="language">{{ language }}</li>
              </template>
              <template v-else>
                <li class="disabled">No data found.</li>
              </template>
            </ul>
          </div>
          <div class="signup-validate" :class="{ 'has-error': errors.lang }">
            <span class="signup-control-tips">{{ errors.lang }}</span>
          </div>
          <!--<select class="profile-edit-control" v-model="info.lang" @change="changeLanguage">
            <option v-for="(country, index) of countries" :value="country.languages.native + ' (' + country.name + ')'" :key="index" :data-code="country.phone">{{ country.languages.native }} ({{ country.name }})</option>
          </select>-->
        </div>
        <div class="profile-edit-datum">
          <label>Phone Number</label>
          <div class="profile-edit-phone">
            <div class="profile-edit-control-wrap">
              <input class="profile-edit-control" name="code" ref="code" v-model="code" @focus="showPhoneCode" @blur="hidePhoneCode" @input="clearError('code')" autocomplete="off">
              <ul class="languages-list" v-show="phoneCodeVisible" @click="changePhoneCode">
                <template v-if="phoneCodeSearch.length">
                  <li v-for="(country, index) of phoneCodeSearch" :key="index" :data-code="country.phone">{{ "+" + country.phone }}</li>
                </template>
                <template v-else>
                  <li class="disabled">No data found.</li>
                </template>
              </ul>
            </div>
            <!--<select class="profile-edit-phone-code" name="code" v-model="code" disabled>
              <option v-for="(country, index) of countries" :key="index" :value="country.phone">+{{ country.phone }}</option>
            </select>-->
            <input class="profile-edit-control" type="tel" name="phone" v-model="phone">
          </div>
          <div class="signup-validate" :class="{ 'has-error': errors.code }">
            <span class="signup-control-tips">{{ errors.code }}</span>
          </div>
        </div>
        <div class="profile-edit-datum">
          <label>Occupation</label>
          <input class="profile-edit-control" type="text" name="occupation" v-model="info.occupation">
        </div>
        <div class="profile-edit-datum">
          <label>Race/Ethnicity</label>
          <input class="profile-edit-control" type="text" name="race" v-model="info.race">
        </div>
        <div class="profile-edit-datums">
          <div class="profile-edit-datum">
            <label>Height<em class="unit">(eg: 8'59")</em></label>
            <input class="profile-edit-control" type="tel" name="height" v-model="info.height">
          </div>
          <div class="profile-edit-datum">
            <label>Chest<em class="unit">(eg: 8'59")</em></label>
            <input class="profile-edit-control" type="tel" name="bust" v-model="info.bust">
          </div>
          <div class="profile-edit-datum">
            <label>Hips<em class="unit">(eg: 8'59")</em></label>
            <input class="profile-edit-control" type="tel" name="hips" v-model="info.hips">
          </div>
          <div class="profile-edit-datum">
            <label>Waist<em class="unit">(eg: 8'59")</em></label>
            <input class="profile-edit-control" type="tel" name="waist" v-model="info.waist">
          </div>
          <div class="profile-edit-datum">
            <label>Shoe Size<em class="unit">(eg: 8'59")</em></label>
            <input class="profile-edit-control" type="tel" name="shoe_size" v-model="info.shoe_size">
          </div>
        </div>
        <div class="profile-edit-datum">
          <label>Bio</label>
          <textarea class="profile-edit-textarea" placeholder="Write something about you, your interest and past campaigns…" cols="30" rows="5" name="bio" v-model="info.bio"></textarea>
        </div>
        <div class="profile-edit-datum">
          <label>Label</label>
          <div class="profile-edit-labels" @click="checkLabel">
            <span v-for="label of labels" :key="label.id" :class="{ checked: includeSystemLabel(label.id) }" :data-id="label.id">{{ label.name }}</span>
          </div>
        </div>
        <div class="profile-edit-datum">
          <div class="profile-edit-labels profile-custom-labels" @click="deleteCustomLabel">
            <span v-for="(label, index) of customLabels" :key="index" class="checked">{{ label.name }}</span>
          </div>
          <div class="profile-custom-labels-add-wrap">
            <input type="text" class="profile-edit-control profile-custom-labels-control" placeholder="Add your own labels" ref="profileCustomLabelsControl">
            <button class="add-label" type="button" @click.prevent="addCustomLabel"><span>+</span></button>
          </div>
        </div>
        <div class="profile-edit-datum">
          <label>My works</label>
          <p class="profile-edit-works">(Please upload your works with others clients or yourself creativity, we could help you faster to target to new campaign)</p>
          <div class="profile-edit-file">
            <span>Choose file</span>
            <input type="file" accept="image/jpeg,image/gif,image/png,video/mp4" multiple ref="file" @change="readFiles" title="">
          </div>
          <em class="profile-type-supported">Only the following formats are supported: jpg,png,gif,mp4.</em>
          <div class="profile-files">
            <template v-for="url of info.url">
              <div v-if="url" :key="url" class="profile-file">
                <template v-if="url.match(/.mp4$/i)">
                  <video :src="url" alt="" width="100%" height="100%" controls></video>
                </template>
                <template v-else>
                  <img :src="url" alt="">
                </template>
                <div class="profile-file-delete">
                  <i class="fa fa-trash-o" aria-hidden="true" @click="deleteUrl(1, url)"></i>
                </div>
              </div>
            </template>
            <div class="profile-file" v-for="file of fileUrls" :key="file.time">
              <template v-if="file.type === 'image'">
                <img :src="file.url" alt="">
              </template>
              <template v-else-if="file.type === 'video'">
                <video :src="file.url" width="100%" height="100%" controls></video>
              </template>
              <div class="profile-file-delete">
                <i class="fa fa-trash-o" aria-hidden="true" @click="deleteUrl(2, file.time)"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="info-tips">{{ formTips }}</div>
        <button type="submit" class="info-sub" :disabled="isRefer || !Object.keys(info).length">
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
import Datepicker from 'vuejs-datepicker';
import Loading from "../Loading";

import _ from "lodash";
import moment from "moment";

import { mapState } from "vuex";
import axios from "axios";

export default {
  name: "InfoEdit",

  components: {
    Datepicker,
    Loading
  },

  props: ["systemTips", "info"],

  data() {
    return {
      errors: {
        date: "",
        lang: "",
        code: ""
      },
      formTips: "",
      isRefer: false,
      fileUrls: [], // 图片文件
      languages: {},
      countries: [],
      innerCode: null,
      innerPhone: null,
      innerTag: this.info.tag,
      languagesVisible: false,
      phoneCodeVisible: false,
      maxFileSize: 200 * 1024 * 1024,
      primaryLanguages: ["Arabic","Chinese","Czech","Danish","Dutch","English","Estonian","Finnish","French","German","Greek","Hebrew","Hindi","Hungarian","Italian","Japanese","Korean","Lithuanian","Norwegian","Portuguese","Polish","Russian","Spanish","Swedish","Turkish","Ukrainian"]
    };
  },

  computed: {
    ...mapState(["basicInformation", "labels"]),

    // 系统标签
    systemLabels() {
      return this.innerTag !== undefined ? this.innerTag.length > 0 ? this.innerTag.filter(val => +val.user_id === 0) : [] : [];
    },

    // 自定义标签
    customLabels() {
      // console.log(this.info.tag);
      return this.innerTag !== undefined ? this.innerTag.filter(val => val.user_id === undefined || +val.user_id !== 0) : [];
    },

    code: {
      get() {
        let str = this.innerCode != null ? this.innerCode : this.info.phone ? this.info.phone.split("-")[0] : "";
        if (str && str.indexOf("+") === -1) {
          str = "+" + str;
        }
        return str;
      },
      set(value) {
        this.innerCode = value;
      }
    },

    phone: {
      get() {
        return this.innerPhone != null ? this.innerPhone : this.info.phone ? this.info.phone.split("-")[1] : "";
      },
      set(value) {
        this.innerPhone = value;
      }
    },

    languagesBySearch() {
    // <li v-for="(country, index) of countries" :key="index" :data-code="country.phone">{{ country.languages.native }} ({{ country.name }})</li>
      /*if (!this.info.lang) {
        return this.countries;
      } else {
        return this.countries.filter(country => {
          let str1 = this.info.lang.split(" ")[0].toLowerCase();
          let str2 = (this.info.lang.indexOf("(") > -1 ? this.info.lang.split("(")[1].replace(")", "") : this.info.lang).toLowerCase();
          return country.languages.native.toLowerCase().indexOf(str1) > -1 || country.name.toLowerCase().indexOf(str2) > -1;
        });
      }*/
      if (!this.info.lang) {
        return this.primaryLanguages;
      } else {
        return this.primaryLanguages.filter(language => {
          return language.toLowerCase().indexOf(this.info.lang.toLowerCase()) > -1;
        });
      }
    },

    phoneCodeSearch() {
      if (!this.code) {
        return this.countries;
      } else {
        return this.countries.filter(country => {
          return country.phone.toString().indexOf(this.code.toString().replace(/\+/, "")) > -1;
        });
      }
    }
  },

  created() {
    this.getLabels();
    this.getCountriesAndLanguages();
  },

  methods: {
    /**
     * 获取默认标签
     */
    getLabels() {
      this.$store.dispatch("queryLabel")
        .then(res => {
          if (+res.code !== 1) {
            this.tips = res.info;
          } else {
            this.tips = "";
          }
        })
        .catch(e => {
          this.tips = e.message || e;
        });
    },

    /**
     * 语言排序
     */
    sort(arr, prop) {
      if (prop.indexOf(".") > -1) {
        let params = prop.split(".");
        return _.sortBy(arr, item => {
          // console.info(item[params[0]][params[1]], prop, item);
          return item[params[0]][params[1]];
        });
      } else {
        return _.sortBy(arr, item => {
          // console.info(item[prop], prop, item);
          return +item[prop];
        });
      }
    },

    /**
     * 查询国家和语言
     */
    getCountriesAndLanguages() {
      /*axios.all([this.getCountries(), this.getLanguages()])
        .then(axios.spread((countries, languages) => {
          this.countries = [];
          for (let country of Object.values(countries.data)) {
            for (let lang of country.languages) {
              let object = {};
              object.name = country.name;
              object.native = country.native;
              object.phone = country.phone;
              object.languages = languages.data[lang];
              // console.log(lang, languages.data[lang]);
              this.countries.push(object);
            }
          }

          this.countries = this.sort(this.countries, "languages.name");
        }));*/

      this.getCountries()
        .then(res => res.data)
        .then(data => {
          this.countries = [];
          this.countries.length = 0;
          for (let country of Object.values(data)) {
            let object = {};
            object.name = country.name;
            object.native = country.native;
            object.phone = country.phone;
            object.languages = country.languages;
            this.countries.push(object);
          }

          // this.countries = [...new Set(this.countries)];
          this.countries = this.sort(this.countries, "phone");
          this.countries = this.countries.reduce((accumulator, current) => {
            if (accumulator.length < 1) {
              accumulator.push(current);
            } else {
              if (accumulator[accumulator.length - 1].phone !== current.phone) {
                accumulator.push(current);
              }
            }
            return accumulator;
          }, []);
        });
    },

    /**
     * 获取世界各国语言
     */
    getLanguages() {
      return axios({
        url: "/data/languages.json",
        baseURL: "",
        methods: "get",
      });
    },

    /**
     * 获取国家
     */
    getCountries() {
      return axios({
        url: "/data/countries.json",
        baseURL: "",
        methods: "get",
      });
    },

    /**
     * 切换语言
     */
    changeLanguage(e) {
      if (e.target === e.currentTarget) { return false; }

      if (!e.target.classList.contains("disabled")) {
        this.info.lang = e.target.textContent;
        // this.code = e.target.dataset.code;
      }
      this.languagesVisible = false;
      // this.code = e.target.options[e.target.selectedIndex].dataset.code;
      // console.log(this.code, e.target.selectedIndex, e.target.options[e.target.selectedIndex].dataset.code);
    },

    /**
     * 显示语言
     */
    showLanguages() {
      this.languagesVisible = true;
    },

    /**
     * 隐藏语言
     */
    hideLanguage() {
      setTimeout(() => {
        if (this.languagesVisible) {
          this.languagesVisible = false;
        }
      }, 150);
    },

    /**
     * 切换语言
     */
    changePhoneCode(e) {
      if (e.target === e.currentTarget) { return false; }

      if (!e.target.classList.contains("disabled")) {
        // this.info.lang = e.target.textContent;
        // this.code = e.target.dataset.code;
        this.code = e.target.textContent;
      }
      this.phoneCodeVisible = false;
      // this.code = e.target.options[e.target.selectedIndex].dataset.code;
      // console.log(this.code, e.target.selectedIndex, e.target.options[e.target.selectedIndex].dataset.code);
    },
    /**
     * 显示国家电话代码
     */
    showPhoneCode() {
      this.phoneCodeVisible = true;
    },

    /**
     * 隐藏国家电话代码
     */
    hidePhoneCode() {
      setTimeout(() => {
        if (this.phoneCodeVisible) {
          this.phoneCodeVisible = false;
        }
      }, 150);
    },

    /**
     * 清除错误
     * attr 错误属性
     */
    clearError(attr) {
      this.errors[attr] = "";
    },

    /**
     * 选择日期
     */
    chooseDate(e) {
      let date = new Date(e);

      if (isNaN(date.getDate())) {
        this.info.birth = "";
      } else {
        // let d = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        // this.info.birth = d.toString() + "/" + (date.getDate() < 10 ? ('0' + (date.getDate() + 1)) : date.getDate()).toString() + "/" + date.getFullYear();
        this.info.birth = moment(e).format("MM/DD/YYYY");
      }
      // console.log('chooseDate', date.getMonth(), date.getDate(), date.getFullYear(), this.info.birth);
    },

    /**
     * 日期格式化
     */
    formatDate(date) {
      if (!date) { return date; }
      let str = date.split("/");
      return str[2] + "-" + str[0] + "-" + str[1];
    },

    /**
     * 选择标签
     * @param e
     * @returns {boolean}
     */
    checkLabel(e) {
      if (e.target === e.currentTarget) { return false; }

      let labelId = +e.target.dataset.id;

      if (this.innerTag === undefined) {
        this.innerTag = [];
      }

      if (this.innerTag.findIndex(val => val.id == labelId) === -1) {
        this.innerTag = this.innerTag.concat(this.labels.filter(label => label.id == labelId));
      } else {
        this.innerTag = this.innerTag.filter(val => {
          return val.id != labelId;
        });
      }
    },

    /**
     * 包含系统标签
     */
    includeSystemLabel(id) {
      return this.systemLabels.findIndex(val => val.id == id) > -1;
    },

    /**
     * 删除自定义标签
     */
    deleteCustomLabel(e) {
      if (e.target === e.currentTarget) { return false; }

      let label = e.target.textContent;
      this.innerTag = this.innerTag.filter(val => {
        return !(typeof val.user_id === "undefined" && val.name === label);
      });
    },

    /**
     * 添加自定义标签
     */
    addCustomLabel() {
      let newLabel = this.$refs.profileCustomLabelsControl.value.trim();
      if (newLabel) {
        if (this.innerTag === undefined) {
          this.innerTag = [];
        }
        this.innerTag.push({ name: newLabel });
        this.$refs.profileCustomLabelsControl.value = "";
      }
    },

    /**
     * 获取系统标签id
     */
    systemLabelIds() {
      return this.systemLabels.reduce((prev, next) => {
        if (!Array.isArray(prev)) {
          prev = [];
        }
        prev.push(next.id);
        return prev;
      }, []);
    },

    /**
     * 提交资料
     */
    editProfileSubmit() {
      if (!this.languagesBySearch.length) {
        this.errors.lang = "The selected language does not exist.";
        this.$refs.lang.focus();
        return false;
      }

      if (!this.phoneCodeSearch.length || !this.code.replace(/\+/g, "")) {
        this.errors.code = "The selected phone code does not exist.";
        this.$refs.code.focus();
        return false;
      }

      let params = new FormData(this.$refs.profileEditForm);
      // params.append("id", this.info.id);

      // params.append("full_name", this.info.full_name || "");
      // params.append("social_name", this.info.social_name || "");
      // params.append("gender", this.info.gender || "");
      // params.append("birth", this.info.birth != null ? this.formatDate(this.info.birth) : "");
      // params.append("phone", this.info.phone || "");
      // params.append("lang", this.info.lang || "");
      // params.append("occupation", this.info.occupation || "");
      // params.append("race", this.info.race || "");
      // params.append("height", this.info.height || "");
      // params.append("bust", this.info.bust || "");
      // params.append("hips", this.info.hips || "");
      // params.append("waist", this.info.waist || "");
      // params.append("bio", this.info.bio || "");
      // params.append("sys_tag", JSON.stringify(this.systemLabelIds()));
      // params.append("user_tags", JSON.stringify(this.customLabels));
      // params.append("file", this.$refs.file.files[0] || JSON.stringify(this.info.url));

      if (this.info.id) {
        params.set("id", this.info.id);
      }
      if (this.info.birth) {
        params.set("birth", this.info.birth ? moment(this.info.birth).format("YYYY-MM-DD") : "");
      }
      if (this.info.url) {
        let files = this.info.url.slice();
        // let files = [];
        for (let file of this.fileUrls) {
          let url = this.dataURLtoFile(file.url);
          // console.log("line 506", url);
          files.push(url);
        }
        for (let i = 0; i < files.length; i++) {
          params.append(`file[]`, files[i]);
        }
        // let files = [];
        // files.push(this.dataURLtoFile(this.fileUrls[0].url));
        // params.set("file", JSON.stringify(files));
      }

      if (params.get("phone")) {
        params.set("phone", "+" + params.get("code").replace(/\+/g, "") + "-" + params.get("phone"));
      }
      params.delete("code");

      params.set("sys_tag", JSON.stringify(this.systemLabelIds()));
      params.set("user_tags", JSON.stringify(this.customLabels));

      /*for (let [key, value] of params.entries()) {
        console.info("key:", key, " value:", value);
      }*/
      // console.info("editProfileSubmit: typeof this.info.full_name:", typeof this.info.full_name, 'typeof params.get("full_name"):', typeof params.get("full_name"));

      this.isRefer = true;
      this.$store.dispatch("modifyProfile", params)
        .then(res => {
          if (+res.code === 1000) {
            return this.redirectSignIn();
          }

          if (+res.code === 1) {
            this.$parent.getPerfectInfo();
            this.$router.replace("/profile/info");
          } else {
            this.formTips = res.info;
          }
          this.isRefer = false;
        })
        .catch(e => {
          this.formTips = e.message || e;
          this.isRefer = false;
        });
    },

    /**
     * 读取文件
     */
    readFiles() {
      let fileLen = typeof this.info.url !== "undefined" ? this.info.url.length : 0;

      /*if (fileLen + this.fileUrls.length >= 5) {
        this.formTips = "Up to 5 pictures.";
      }*/

      if (this.$refs.file.files.length > 0) {
        for (let file of this.$refs.file.files) {
          console.log(file.type, file.name, file.size);
          /*if (file.type.match(/^video/i)) {
            this.videos.push(file);
          } else {

          }*/
          if (file.size < this.maxFileSize) {
            this.readFile(fileLen, file);
          } else {
            this.formTips = `Single file cannot exceed ${this.maxFileSize/(1024*1024)}MB.`;
          }
        }
      }
    },

    /**
     * 读取文件
     */
    readFile(fileLen, file) {
      let vm = this;

      let reader = new FileReader();
      reader.onload = function (ev) {
        // console.log("ev.target:", ev.target);

        /*if (fileLen + vm.fileUrls.length >= 5) {
          vm.$refs.file.value = "";
          return false;
        }*/
        let obj = {};
        obj.time = +new Date;
        obj.url = ev.target.result;
        obj.type = file.type.split("/")[0].toLowerCase();
        vm.fileUrls.push(obj);
      };
      reader.readAsDataURL(file);
    },

    /**
     * 删除文件
     * @param type
     * @param url
     */
    deleteUrl(type, url) {
      if (type === 1) {
        this.info.url = this.info.url.filter(val => {
          return val !== url;
        });
      } else if (type === 2) {
        this.fileUrls = this.fileUrls.filter(val => {
          return val.time !== url;
        });
      }
    },
    /**
     * 图片base64转file格式
     * @param dataUrl
     * @returns {File}
     */
    dataURLtoFile(dataUrl) {
      let arr = dataUrl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      let suffix = mime.split("/")[1];
      suffix = suffix === "jpeg" ? "jpg" : suffix;
      let filename = +new Date + "." + suffix;  console.log("filename", filename);
      return new File([u8arr], filename, {
        type: mime
      });
    }
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
