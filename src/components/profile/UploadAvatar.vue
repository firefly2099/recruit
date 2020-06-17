<template>
  <div class="pa upload-dialog" id="uploadDialog">
    <!-- loading 动画 -->
    <div class="sk-circle-bounce" id="waiting">
      <div class="sk-child sk-circle-1"></div>
      <div class="sk-child sk-circle-2"></div>
      <div class="sk-child sk-circle-3"></div>
      <div class="sk-child sk-circle-4"></div>
      <div class="sk-child sk-circle-5"></div>
      <div class="sk-child sk-circle-6"></div>
      <div class="sk-child sk-circle-7"></div>
      <div class="sk-child sk-circle-8"></div>
      <div class="sk-child sk-circle-9"></div>
      <div class="sk-child sk-circle-10"></div>
      <div class="sk-child sk-circle-11"></div>
      <div class="sk-child sk-circle-12"></div>
    </div>

    <div class="pa gesture-wrapper" id="gestureWrapper">
      <div class="gesture-box pa" id="gestureBox"></div>
      <svg style="position: absolute;" width="100%" height="100%">
        <defs>
          <mask id="myMask">
            <rect x="0" y="0" width="100%" height="100%" fill="#fff" stroke="none"></rect>
            <rect id="rectangleMask" width="0" height="0" x='0' y="0"></rect>
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" style="stroke: none; fill: rgba(0, 0, 0, 0.7); mask: url(#myMask)"></rect>
      </svg>
    </div>

    <div class="gesture-box pa gesture-border" id="gestureBorder"></div>
    <button class="btn btn-danger upload-btn upload-cancel" id="uploadCancel" @click="cancel" :disabled="isRefer">取 消</button>
    <button class="btn btn-danger upload-btn upload-save" id="uploadSave" :disabled="isRefer">保 存</button>
    <div class="zoom-btn btn" :class="{ disabled: isRefer }">
      <button class="upload-minus" ref="minus" id="uploadMinus" :disabled="isRefer"><i class="fa fa-search-minus" aria-hidden="true"></i></button>
      <button class="upload-plus" ref="plus" id="uploadPlus" :disabled="isRefer"><i class="fa fa-search-plus" aria-hidden="true"></i></button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Upload from "../../assets/js/upload";

export default {
  name: "UploadAvatar",

  data() {
    return {
      isRefer: false,
      upload: null,
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.proxyVue.$on("uploadAvatar", val => {
        console.log("this.$refs.minus", this.$refs.minus, this.$refs.plus);
        this.upload = new Upload({
          cancel: this.cancel,
          saveCallback: this.save
        });
        // this.upload.cancel = this.cancel;
        // this.upload.saveCallback = this.save;
        this.upload.init({
          file: val,
          minus: document.querySelector("#uploadMinus"),
          plus: document.querySelector("#uploadPlus")
        });
      });
    });
  },

  computed: {
    ...mapState(["userInfo"])
  },

  methods: {
    /**
     * 取消上传
     */
    cancel() {
      document.querySelector('#gestureBorder').style.opacity = "0";
      document.querySelector('#gestureBox').innerHTML = "";
      setTimeout(() => {
        this.$store.commit("setAvatarPageStatus", false);
      }, 0);
    },

    /**
     * 保存图片
     */
    save(imgData) {
      if (this.isRefer) { return false; }
      this.isRefer = true;

      let formData = new FormData();
      formData.append("id", this.userInfo.id);
      let file = this.dataURLtoFile(imgData, Math.random() + ".jpg");
      console.info("file：", file);
      formData.append("file", file);
      this.$store.dispatch("uploadAvatar", formData)
        .then(res => {
          if (+res.code === 1000) {
            this.cancel();
            return this.redirectSignIn();
          }

          if (+res.code === 1) {
            this.cancel();
            this.$store.commit("setUserAvatar", res.data.headimg);
          } else {
            alert(res.info);
          }
          this.isRefer = false;
        })
        .catch(e => {
          console.log(e.message || e);
          this.isRefer = false;
        });
    },

    /**
     * 图片base64转file格式
     * @param dataUrl
     * @param filename
     * @returns {File}
     */
    dataURLtoFile(dataUrl, filename) {
      let arr = dataUrl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {
        type: mime
      });
    }
  },

  beforeDestroy() {
    this.upload.destroy();
    this.upload = null;
    this.proxyVue.$off("uploadAvatar");
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common";

/* 编辑头像弹窗 */
.upload-dialog { position: fixed; width: 100%; height: 100%; left: 0; top: 0; z-index: 10000; background-color: rgba(0, 0, 0, .5); overflow: hidden; }
.upload-dialog.show { display: block; }
.upload-dialog.show .sk-circle-bounce { display: block; }

/* loading */
.sk-circle-bounce {
  width: 4em;
  height: 4em;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  /*display: none;*/
}
.sk-circle-bounce .sk-child {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.sk-circle-bounce .sk-child:before {
  content: '';
  display: block;
  margin: 0 auto;
  width: 15%;
  height: 15%;
  background-color: #fff;
  border-radius: 100%;
  /* -webkit-animation: sk-circle-bounce-delay 1.2s infinite ease-in-out both; */
  animation: sk-circle-bounce-delay 1.2s infinite ease-in-out both;
}
.sk-circle-bounce .sk-circle-2 {
  -webkit-transform: rotate(30deg);
  transform: rotate(30deg);
}
.sk-circle-bounce .sk-circle-3 {
  -webkit-transform: rotate(60deg);
  transform: rotate(60deg);
}
.sk-circle-bounce .sk-circle-4 {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}
.sk-circle-bounce .sk-circle-5 {
  -webkit-transform: rotate(120deg);
  transform: rotate(120deg);
}
.sk-circle-bounce .sk-circle-6 {
  -webkit-transform: rotate(150deg);
  transform: rotate(150deg);
}
.sk-circle-bounce .sk-circle-7 {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}
.sk-circle-bounce .sk-circle-8 {
  -webkit-transform: rotate(210deg);
  transform: rotate(210deg);
}
.sk-circle-bounce .sk-circle-9 {
  -webkit-transform: rotate(240deg);
  transform: rotate(240deg);
}
.sk-circle-bounce .sk-circle-10 {
  -webkit-transform: rotate(270deg);
  transform: rotate(270deg);
}
.sk-circle-bounce .sk-circle-11 {
  -webkit-transform: rotate(300deg);
  transform: rotate(300deg);
}
.sk-circle-bounce .sk-circle-12 {
  -webkit-transform: rotate(330deg);
  transform: rotate(330deg);
}
.sk-circle-bounce .sk-circle-2:before {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}
.sk-circle-bounce .sk-circle-3:before {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}
.sk-circle-bounce .sk-circle-4:before {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}
.sk-circle-bounce .sk-circle-5:before {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}
.sk-circle-bounce .sk-circle-6:before {
  -webkit-animation-delay: -0.7s;
  animation-delay: -0.7s;
}
.sk-circle-bounce .sk-circle-7:before {
  -webkit-animation-delay: -0.6s;
  animation-delay: -0.6s;
}
.sk-circle-bounce .sk-circle-8:before {
  -webkit-animation-delay: -0.5s;
  animation-delay: -0.5s;
}
.sk-circle-bounce .sk-circle-9:before {
  -webkit-animation-delay: -0.4s;
  animation-delay: -0.4s;
}
.sk-circle-bounce .sk-circle-10:before {
  -webkit-animation-delay: -0.3s;
  animation-delay: -0.3s;
}
.sk-circle-bounce .sk-circle-11:before {
  -webkit-animation-delay: -0.2s;
  animation-delay: -0.2s;
}
.sk-circle-bounce .sk-circle-12:before {
  -webkit-animation-delay: -0.1s;
  animation-delay: -0.1s;
}

@-webkit-keyframes sk-circle-bounce-delay {
  0%, 80%, 100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

@keyframes sk-circle-bounce-delay {
  0%, 80%, 100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

.gesture-wrapper {
  left: 0; top: 0; right: 0; bottom: 0;
}
.gesture-box {
  left: 0; right: 0; position: absolute; top: 50%; transform: translateY(-50%); margin-left: auto; margin-right: auto;
}
.gesture-border { position: absolute; border: 1px solid #fff; pointer-events: none; top: 50%; transform: translateY(-50%); box-sizing: border-box;
  opacity: 0; }
.file-wrapper {
  position: relative; clear: both; overflow: hidden;
}
.file-wrapper > input { width: 30%; height: 36px; opacity: 0; position: relative; }
.file-wrapper > a { display: block; padding: 6px 12px; position: absolute; left: 0; top: 0; }
.upload-btn { position: absolute; padding: 5px 20px; top: 35px; display: block; color: #fff; font-size: 18px; border-radius: 5px; }
.upload-cancel {
  left: 20px; background-color: #e40000;
  &:active {
    background-color: #52cc0f;
  }
}
.upload-save {
  right: 20px; background-color: #4ecc47;
  &:active {
    background-color: #56e14e;
  }
}
.avatar-preview { float: right; max-width: 30%; transform: translateX(-80%); }
.avatar-preview > img { display: block; width: 100%; max-width: 100%; }

.zoom-btn {
  @include pa;
  bottom: 20px;
  right: 0;
  left: 0;
  margin-left: auto;
  margin-right: auto;
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  align-items: center;
  background-color: #fff;
  width: 100px;

  .upload-minus,
  .upload-plus {
    width: 50%;
    box-sizing: border-box;
    padding: 5px 10px;
    color: #070707;
    height: 100%;

    i {
      font-size: 24px;
    }

    &:active {
      background-color: #ccc;
    }
  }
  .upload-minus {
    border-right: 1px solid #ddd;
    /*background-color: #070707;*/
  }
}

.btn {
  &:disabled, &.disabled {
    filter: grayscale(0.9);
    opacity: 0.7;
  }
}
</style>
