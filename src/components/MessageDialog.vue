<template>
  <div class="dialog" id="imageExistDialog" :class="{ show: imageExist }">
    <!-- 图片已存在提示弹窗 -->
    <div class="dialog-bg"></div>
    <div class="dialog-content dialog-box">
      <h4 class="dialog-top">
        <template v-if="message.code === 1">
          <i class="fa fa-warning" aria-hidden="true"></i>{{ message.title || "Warning" }}
        </template>
        <template v-else-if="message.code === 2">
          <i class="fa fa-check-circle" aria-hidden="true"></i>{{ message.title || "Success" }}
        </template>
        <template v-else>
          <i class="fa fa-info-circle" aria-hidden="true"></i>{{ message.title || "Tips" }}
        </template>
      </h4>
      <div class="dialog-main">
        <p class="dialog-text">
          <!--<i class="fa fa-check-circle" aria-hidden="true" v-if="message.code === 2"></i>-->
          {{ message.msg }}
        </p>
      </div>
      <div class="dialog-btn-wrap">
        <!--<button
          type="button"
          class="image-exist-btn-cancel"
          id="imageExistCancel"
          @click="cancelUpload"
        >
          取消
        </button>-->
        <button
          type="button"
          class="btn"
          :class="{ success: message.code === 2, warning: message.code === 1, info: (message.code !== 2 && message.code !== 1)}"
          @click="close"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "MessageDialog",
  data() {
    return {
      imageExist: false, // 是否显示弹窗
      imageName: null // 已存在的图片名
    };
  },

  computed: {
    ...mapState([ "message" ])
  },

  mounted() {
    this.$nextTick(() => {
    });
  },

  methods: {
    /**
     * 关闭弹窗
     */
    close() {
      setTimeout(() => {
        this.$store.commit("setMessage", {
          msg: "",
          code: 0
        });
      }, 10);
    },

    /**
     * 确定添加重复图片
     */
    sureUpload() {
      this.wholesale.$emit("addRepeatImage", true);
      this.closeImageExistDialog();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/css/common";

.dialog {
  @include full;
  position: fixed;
  z-index: 10000;
  /*display: none;*/

  .dialog-bg {
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.7);
  }
}

.dialog-top {
  font-size: 22px;
  text-indent: 0.5em;
  padding: 10px 0;
  border-bottom: 1px solid #d0d0d0;
  color: #333;
  /*display: flex;
  align-items: center;*/
}

.fa-warning,
.fa-info-circle,
.fa-check-circle {
  display: inline;
  margin-right: 5px;
  @include pr;
  top: 2px;
}
.fa-info-circle {
  color: #4c99cf;
}
.fa-warning {
  color: #ffc107;
}
.fa-check-circle {
  color: #5bbd72;
  /*color: #46d217;*/
  /*font-size: 40px;
  @include pr;
  top: 6px;*/
}

/* 图片已存在提示弹窗 */
.dialog-box {
  @include pa;
  width: 500px;
  max-width: 100%;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  left: 50%;
  top: 42%;
  margin: -150px 0 0 -250px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.6);

  .dialog-main {
    padding: 30px;
    line-height: 1.6;
    font-size: 18px;
    /*margin-bottom: 15px;*/
    color: #333;
    min-height: 100px;
    overflow: hidden;
    .dialog-text {
      padding-left: 5px;
      /*display: flex;
      align-items: center;*/
      line-height: 1.6;
    }
    .exist-image-name {
      color: #eb145b;
      font-weight: normal;
      word-break: break-all;
    }
  }
  .dialog-btn-wrap {
    width: 60%;
    padding: 15px 0;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    .btn {
      margin: 0 30px;
      padding: 10px 40px;
      font-size: 18px;
      border-radius: 5px;
      box-sizing: border-box;
      color: #fff;
    }
    .warning {
      background-color: #ffc107;
      &:active {
        background-color: #efb507;
      }
    }
    .info {
      background-color: #4c99cf;
      &:active {
        background-color: #4890c3;
      }
    }
    .success {
      background-color: #28a745;
      &:active {
        background-color: #269d41;
      }
    }
  }
  .image-exist-btn-cancel,
  .image-exist-btn-sure {

  }
  .image-exist-btn-cancel {
    border: 1px solid #ddd;
    background: none;
    color: #333;
    &:active {
      background: #eaeaea;
    }
  }
  .image-exist-btn-sure {
    background-color: #46d217;

    border: none;
    &:active {
      background: #40bf15;
    }
  }
}

@media screen and (max-width: 560px) {
  .dialog-box {
    width: 90%;
    height: auto;
    left: 5%;
    margin-left: 0;

    .dialog-top {
      font-size: px2rem(28px);
    }

    .dialog-main {
      max-height: 120px;
      font-size: px2rem(22px);
      min-height: 80px;
      padding: px2rem(30px);
    }
  }
}

</style>
