import axios from "axios";

export default {
  data() {
    return {
      countries: [],
      states: [],
      cities: [],
      countriesData: {},
      statesData: {},
      citiesData: {},
    };
  },

  created() {
    // document.querySelector(".profile-rates-select").value = "";
    if (!this.countries.length) {
      this.getCountries();
    }
  },

  methods: {
    /**
     * 获取国家数据
     */
    getCountries() {
      axios({
        url: "/data/LocList.xml",
        baseURL: "",
        methods: "get",
        responseType: "xml"
      })
        .then(res => res.data)
        .then(data => {
          let parser = new DOMParser();
          this.countriesData = parser.parseFromString(data, "text/xml");
          this.countriesData.getElementsByTagName("CountryRegion").forEach(ele => {
            let obj = {};
            obj.name = ele.getAttribute("Name");
            obj.code = ele.getAttribute("Code");
            this.countries.push(obj);
          });

          this.timer = setInterval(() => {
            if (Object.keys(this.initData).length > 0) {
              clearInterval(this.timer);
              this.chooseCountry(true);
            }
          }, 20);
        })
        .catch(e => {
          this.formTips = (e.message || e);
        });
    },

    /**
     * 选择国家
     */
    chooseCountry(flag) {
      clearInterval(this.timer);
      for (let ele of Array.from(this.countriesData.getElementsByTagName("CountryRegion"))) {
        if (ele.getAttribute("Name") === this.initData.country) {
          this.statesData = ele;
          break;
        }
      }

      if (flag === false) {
        this.initData.state = "";
        this.initData.city = "";
      }

      this.clearCityData();

      if (this.statesData.getElementsByTagName("State").length > 0 && this.statesData.getElementsByTagName("State")[0].getAttribute("Name")) {
        this.setStates();
        if (flag === true) {
          this.chooseState(true);
        }
      } else {
        this.clearStateData();

        if (this.statesData.getElementsByTagName("State").length > 0) {
          this.citiesData = this.statesData.querySelector("State");
          this.setCities();
        } else {
          this.clearCityData();
          this.citiesData = null;
          this.initData.city = "";
        }
        this.statesData = null;
        this.initData.state = "";
      }
    },

    /**
     * 选择省份/州
     */
    chooseState(flag) {
      for (let ele of Array.from(this.statesData.getElementsByTagName("State"))) {
        if (ele.getAttribute("Name") === this.initData.state) {
          this.citiesData = ele;
          break;
        }
      }

      flag === false && (this.initData.city = "");
      this.setCities();
    },

    /**
     * 设置省份数据
     */
    setStates() {
      this.clearStateData();
      this.statesData.getElementsByTagName("State").forEach(ele => {
        let obj = {};
        obj.name = ele.getAttribute("Name");
        obj.code = ele.getAttribute("Code");
        this.states.push(obj);
      });
    },

    /**
     * 设置城市数据
     */
    setCities() {
      this.clearCityData();
      this.citiesData.getElementsByTagName("City").forEach(ele => {
        let obj = {};
        obj.name = ele.getAttribute("Name");
        obj.code = ele.getAttribute("Code");
        this.cities.push(obj);
      });
    },

    /**
     * 清除省份数据
     */
    clearStateData() {
      this.states.length = 0;
      this.states = [];
    },

    /**
     * 清除城市数据
     */
    clearCityData() {
      this.cities.length = 0;
      this.cities = [];
    }
  }
}
