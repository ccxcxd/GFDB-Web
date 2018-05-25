var imgLoader = {
    loading: false,

    loaders: [],

    imgs: {},

    add: function (src) {
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
    },

    onload: function (callback) {
        this.loading = true;
        var thiz = this;
        $.when.apply($, this.loaders).done(function () {
            thiz.loaders = [];
            thiz.loading = false;
            callback();
        });
    }
};
