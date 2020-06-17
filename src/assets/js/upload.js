import PhotoTransform from "./gestureByHammer";
import EXIF from "exif-js";

/**
 * 上传图片
 */
export default class {
  constructor(options) {
    this.wrap = '';
    this.wrapW = '';
    this.wrapH = '';
    this.standard = 320;  // 标准图片大小，640px
    this.initStandard = 320;
    this.isUpload = false;
    this.photoTransform = null;
    this.uploadImg = null;
    this.timer = null;
    this.canvasScale = null;
    this.cancel = options.cancel;
    this.saveCallback = options.saveCallback;
  }

  init(options) {
    document.querySelector('#waiting').style.display = "block";

    this.standard = this.initStandard * window.devicePixelRatio;
    let self = this;
    this.wrap = document.querySelector('#gestureBox');
    this.wrapW = parseInt(window.getComputedStyle(this.wrap).width);
    this.wrapH = this.wrapW;

    this.setSvgMask(this.wrapW, this.wrapH);
    this.windowResize = function(){
      self.resize();
    };
    window.addEventListener("resize", this.windowResize, false);

    self.isUpload = true;
    self.readPhoto(options.file);

    this.bindHandlers(options.minus, options.plus);
  }

  resize() {
    let self = this;
    clearTimeout(self.timer);
    self.timer = setTimeout(() => {
      let w = parseInt(window.getComputedStyle(self.wrap).width);
      self.setSvgMask(w, w);
      if (self.wrapW !== w && self.photoTransform != null) {
        let s = ((self.wrapW - w) / w) * self.photoTransform.transform.scale;
        self.photoTransform.modifyScale(s);
      }

      if (self.canvasScale != null) {
        let canvasW = self.wrap.children[0].clientWidth,
          canvasH = self.wrap.children[0].clientHeight;
        self.canvasScale = canvasW < canvasH ? canvasW / self.wrapW : canvasH / self.wrapW;
      }
    }, 150);
  }

  // 设置svg遮罩
  setSvgMask(wrapW, wrapH) {
      let winW = document.documentElement.clientWidth,
        winH = window.innerHeight;

      wrapW = winW - 100;
      wrapW = wrapW > this.standard ? this.standard : wrapW;
      wrapH = wrapW;
      this.wrapW = wrapW;
      this.wrapH = wrapH;

      let left = Math.round((winW - wrapW) / 2),
        top = Math.round((winH - wrapH) / 2);

      this.wrap.style.width = wrapW + 'px';
      this.wrap.style.height = wrapH + 'px';
      let gestureBorder = document.querySelector('#gestureBorder');
      gestureBorder.style.width = (wrapW + 2) + 'px';
      gestureBorder.style.height = (wrapH + 2) + 'px';
      gestureBorder.style.opacity = "1";
      // gestureBorder.style.left = (left - 1) + 'px';
      //gestureBorder.style.top = (top - 1) + 'px';

      const rectangle = document.querySelector('#rectangleMask');
      rectangle.setAttribute('width', (wrapW) + 'px');
      rectangle.setAttribute('height', (wrapH) + 'px');
      rectangle.setAttribute('x', left + 'px');
      rectangle.setAttribute('y', top + 'px');
  }

  //读取图片
  readPhoto(file) {
      let self = this;
      let reader = new FileReader;

      if (file !== undefined) {
          reader.onload = function () {
              let result = this.result;
              EXIF.getData(file, function () {
                  EXIF.getAllTags(this);
                  let orient = parseInt(EXIF.getTag(this, 'Orientation'), 10);
                  if (typeof orient === 'undefined' || isNaN(orient)) {
                      orient = 0;
                  }
                  self.createPicture(result, orient);
              });
          };
          reader.readAsDataURL(file);
      } else {
          console.info('not choose file...');
          self.isUpload = false;
          document.querySelector('#waiting').style.display = "none";
      }
  }

  // 生成图片
  createPicture(url, orient) {
      let self = this;
      let image = new Image();
      image.src = url;
      image.onload = function () {
          self.drawPicture(image, orient);
      }
  }

  // 画图
  drawPicture(image, orient) {
      let c = {
          w: 0,
          h: 0,
          scale: 1,
          angle: 0
      };

      let canvas = document.createElement('canvas'),
          context = canvas.getContext('2d'),
          imgW = image.width,
          imgH = image.height;

      switch (orient) {
          case 6:
              c.angle = 90;
              break;
          case 8:
              c.angle = -90;
              break;
          case 3:
              c.angle = 180;
              break;
          default:
              c.angle = 0;
              break;
      }

      let tempW, tempH;
      if (c.angle === 90 || c.angle === -90) {
          tempW = imgH;
          tempH = imgW;
      } else {
          tempW = imgW;
          tempH = imgH;
      }

      let tx = tempW > tempH ? tempH : tempW;
      this.middleW = tx >= 2000 ? 2000 : tx; // 为保证图片清晰度，过大的图片缩小后宽度为640

      if (tempW/tempH > this.wrapW/this.wrapH) {
          c.scale = this.middleW / tempH;
          c.h = this.middleW;
          c.w = Math.round(tempW * c.scale);
      } else {
          c.scale = this.middleW / tempW;
          c.w = this.middleW;
          c.h = Math.round(tempH * c.scale);
      }

      canvas.width = c.w;
      canvas.height = c.h;

      context.translate(c.w/2, c.h/2);
      context.scale(c.scale, c.scale);
      context.rotate(c.angle * Math.PI / 180);
      context.drawImage(image, -imgW/2, -imgH/2);

      let tranX = -c.w / 2,
          tranY = -c.h / 2;

      this.canvasScale = this.wrapW / this.middleW;

      canvas.style['position'] = 'absolute';
      canvas.style['left'] = '50%';
      canvas.style['top'] = '50%';
      canvas.style['marginLeft'] = tranX + 'px';
      canvas.style['marginTop'] = tranY + 'px';
      canvas.style['transform'] = `translate3d(0, 0, 0) scale(${this.canvasScale}, ${this.canvasScale})`;

      this.wrap.innerHTML = '';
      this.wrap.appendChild(canvas);
      this.uploadImg = canvas;

      this.isUpload = false;
      document.querySelector('#waiting').style.display = "none";

      if (!this.photoTransform) {
          this.photoTransform = new PhotoTransform({
              box: document.querySelector('#gestureWrapper'),
              el: canvas,
              tranX: 0,
              tranY: 0,
              scale: this.canvasScale || 1
          });
      } else {
          this.photoTransform.reset({
              el: canvas,
              tranX: 0,
              tranY: 0,
              scale: this.canvasScale || 1
          });
      }
  }

  bindHandlers(minus, plus) {
      let self = this;

      //确定头像
      document.querySelector('#uploadSave').addEventListener("click", function () {
        // document.querySelector('#avatar').value = '';
        if (!!self.photoTransform && !self.isUpload) {
            let transform = self.photoTransform.getTransform();
            self.createByUpload(transform);
        } else {
            // dialog.alert('请选择头像...');
        }
      }, false);

    // 缩小
    minus.addEventListener("click", () => {
      if (this.photoTransform != null && this.photoTransform.transform.scale > 0.15) {
        this.photoTransform.modifyScale(-0.1);
      }
    }, false);

    // 放大
    plus.addEventListener("click", () => {
      if (this.photoTransform != null && this.photoTransform.transform.scale < this.canvasScale * 2) {
        this.photoTransform.modifyScale(+0.1);
      }
    }, false);
  }

  //将用户上传的头像画入画布
  createByUpload(options) {
      let canvas = document.createElement('canvas'),
          context = canvas.getContext('2d');

      options.translate.y = Math.round(options.translate.y);
      canvas.width = this.middleW;
      canvas.height = this.middleW;

      context.fillStyle = '#fff';
      context.fillRect(0, 0, this.middleW, this.middleW);

      context.save();
      context.translate(this.middleW/2 + options.translate.x, this.middleW/2 + options.translate.y);
      context.scale(options.scale, options.scale);
      context.drawImage(this.uploadImg, -this.uploadImg.width/2, -this.uploadImg.height/2);
      context.restore();

      this.showResult(canvas);
  }

  //显示结果页
  showResult(uploadImg) {
    let imgData = uploadImg.toDataURL('image/jpeg', 0.8);

    // document.querySelector('#uploadDialog').style.display = "none";
    // document.querySelector('#avatarPreview').html(`<img src="${imgData}">`);
    this.imgData = imgData;

    // document.querySelector('#avatar').parentElement('.form-group').addClass('has-success');
    // document.querySelector('#avatar').nextElementSibling('i').addClass('glyphicon glyphicon-ok').removeClass('glyphicon-remove');
    // document.querySelector('#avatar').parentElement().next('small').hide();

    /*if (this.imgData) {
      document.querySelector('#chooseAvatarBtn').textContent = ('重新选择');
    }*/

    if (typeof this.saveCallback === 'function') {
        this.saveCallback(this.imgData);
    }
  }

  destroy() {
    window.removeEventListener("resize", this.windowResize, false);
    this.windowResize = null;
    clearTimeout(this.timer);
    this.photoTransform = null;
    this.uploadImg = null;
  }
}

