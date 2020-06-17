import Hammer from "hammerjs";

export default (function () {
    function PhotoTransform(options) {
        this.box = options.box;
        this.el = options.el;
        this.start_x = options.tranX;
        this.start_y = options.tranY;
        this.initX = null;
        this.initY = null;
        this.initScale = null;

        this.transform = {
            translate: {x: this.start_x || 0, y: this.start_y || 0},
            scale: options.scale || 1
        };
        this.originalScale = this.transform.scale;  console.log('gesture line 19', this.transform.scale);

        this.init();
    }

    PhotoTransform.prototype.init = function () {
      this.mc = new Hammer.Manager(this.box);
      // this.mc.add(new Hammer.Press({ threshold: 9, pointers: 1, time: 10 }));
      this.mc.add(new Hammer.Pan({ threshold: 5, pointers: 1 }));
      this.mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([this.mc.get('pan')]);

      this.mc.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
      this.mc.add(new Hammer.Tap({ event: 'singletap' }));

      this.mc.get('doubletap').recognizeWith('singletap');
      this.mc.get('singletap').requireFailure('doubletap');

      this.bindHandlers();
    };

    PhotoTransform.prototype.reset = function (options) {
        this.el = options.el;
        this.start_x = options.tranX;
        this.start_y = options.tranY;
        this.initX = null;
        this.initY = null;
        this.initScale = null;

        this.transform = {
            translate: {x: this.start_x || 0, y: this.start_y || 0},
            scale: options.scale || 1
        };
        this.originalScale = this.transform.scale;
    };

    PhotoTransform.prototype.bindHandlers = function () {
        let self = this;

        this.box.addEventListener('touchstart', function (e) {
          e.preventDefault();
        }, false);

        /*this.mc.on('press', function (event) {
          event.preventDefault();
        });*/

        this.mc.on('panstart panmove', function (event) {
            event.preventDefault();
            self.pan(event);
        });

        this.mc.on('pinchstart pinchmove', function (event) {
            event.preventDefault();
            self.pinch(event);
        });

        // 双击
        this.mc.on('doubletap', function (event) {
          event.preventDefault();
          self.doubleTap(event);
        });
    };

    PhotoTransform.prototype.pan = function (event) {
        if (event.type === 'panstart') {
            if (this.initX) {
                this.start_x += this.initX;
            }

            if (this.initY) {
                this.start_y += this.initY;
            }
        }

        this.transform.translate = {
            x: this.start_x + event.deltaX,
            y: this.start_y + event.deltaY
        };

        this.initX = event.deltaX;
        this.initY = event.deltaY;

        this.updateElementTransform();
    };

    PhotoTransform.prototype.pinch = function (event) {
        if (event.type == 'pinchstart') {
            this.initScale = this.transform.scale || 1;
        }

        this.transform.scale = this.initScale * event.scale;
        this.updateElementTransform();
    };

    PhotoTransform.prototype.doubleTap = function () {
      if (this.transform.scale > this.originalScale) {
        this.transform.scale = this.originalScale;
      } else {
        this.transform.scale = this.originalScale * 2;
      }
      this.updateElementTransform();
    };

    PhotoTransform.prototype.modifyScale = function(s) {
        this.transform.scale += s;
        this.updateElementTransform();
    };

    PhotoTransform.prototype.updateElementTransform = function () {
        let self = this;
        window.requestAnimationFrame(function () {
            let matrix = [
                `translate3d(${self.transform.translate.x}px, ${self.transform.translate.y}px, 0)`,
                `scale(${self.transform.scale}, ${self.transform.scale})`
            ];

            matrix = matrix.join(' ');
            self.el.style['transform'] = matrix;
        });
    };

    PhotoTransform.prototype.getTransform = function () {
      return {
        translate: {x: this.transform.translate.x / this.originalScale, y: this.transform.translate.y / this.originalScale},
        scale: this.transform.scale / this.originalScale
      };
        // return this.transform;
    };

    return PhotoTransform;
}());
