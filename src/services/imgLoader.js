import $ from 'jquery'

class ImgLoader {
  loading = false;

  loaders = [];

  imgs = {};

  constructor() {}

  add (src) {
    if (this.loading)
      return false;

    if (src in this.imgs)
      return true;

    var d = $.Deferred();
    var img = new Image();
    var thiz = this;
    img.onload = function () {
      thiz.imgs[src] = img;
      d.resolve();
    }
    img.onerror = function () {
      d.resolve();
    };
    this.imgs[src] = null;
    this.loaders.push(d.promise());
    img.src = src;
    return true;
  }

  onload (cb) {
    this.loading = true;
    var thiz = this;
    $.when.apply($, this.loaders).done(function () {
      thiz.loaders = [];
      thiz.loading = false;
      cb();
    });
  }
};

export default ImgLoader
