//This is used to preload images and preserve image sizes on the product pages.
concrete.Images = (function() {

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }
    for (var i = 0; i <= images.length-1; i++) {
      this.imageLoad(this.getImageUrl(images[i], size));
    }
  }

  function imageLoad(url) {
    new Image().src = url;
  }

  function getImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(/\.(jpg|jpeg|gif|png|tiff|tif|bmp|bitmap)(\?v=\d+)$/i);

    if (match !== null) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + "_" + size + suffix);
    }

    return null;

  }

  function imageSize(src) {
    var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

    if (match !== null) {
      return match[1];
    } else {
      return null;
    }
  }

  function switchImage(image, element, callback) {
    var size = imageSize(element.src);
    var imageUrl = getImageUrl(image.src, size);

    if (typeof callback === 'function') {
      callback(imageUrl, size, element);
    } else {
      element.src = imageUrl;
    }
  }

  function removeProtocol(url) {
    return url.replace(/http(s)?:/, '');
  }

  return {
    preload: preload,
    getImageUrl: getImageUrl,
    imageSize: imageSize,
    imageLoad: imageLoad,
    switchImage: switchImage,
    removeProtocol: removeProtocol,
  };

})();