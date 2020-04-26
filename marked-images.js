/**
 * marked-images.js
 *
 * marked.js plugin renderer for images
 * generate width="a" and height="b" attributes from axb pattern in title string E.g ![](src "100x50")
 *          attr="x" from attr=x (with no "") e.g. ![](src "width=100 height=50 align=right")
 *          vimeo standard <iframe.. ></iframe> from ![](vimeo/nnn) where nnn is the vimeo id
 *
 * usage: marked.use(markedImages(opts))
 *
 * original function: copyright Christopher Jeffrey -- https://github.com/markedjs/marked (MIT License)
 * extension copyright 2015-2020, Jürgen Leschner - github.com/jldec/ - MIT license
 *
**/

var startsWith = require('lodash.startswith');

module.exports = function markedImages(opts) {

  opts = opts || {};
  var imgRoute = opts.fqImages && (opts.fqImages.route || '/images/');
  var imgPrefix = opts.fqImages && opts.fqImages.url;
  var linkPrefix = opts.fqLinks || opts.relPath;
  var xhtml = opts.xhtml;

  return { renderer: {image: renderImage} };

  function renderImage(href, title, text) {

    var out, iframe;

    if (imgPrefix && startsWith(href, imgRoute)) { href = imgPrefix + href; }
    else if (linkPrefix && /^\/([^/]|$)/.test(href)) { href = linkPrefix + href; }

    if (href && (m = href.match(/vimeo\/(\d+)/i))) {
      iframe = true;
      out = '<iframe src="//player.vimeo.com/video/' + m[1] + '"' +
              ' frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen';
    }
    else {
      out = '<img src="' + href + '" alt="' + text + '"';
    }

    var a = (title && title.split(/\s+/)) || [];
    var b = [];
    var m;
    a.forEach(function(w) {
      if ((m = w.match(/^(\d+)x(\d+)$/))) return (out += ' width="' + m[1] + '" height="' + m[2] + '"');
      if ((m = w.match(/^(\w+)=([\w-]+)$/))) return (out += ' ' + m[1] + '="' + m[2] + '"');
      if (w) return b.push(w);
    });
    title = b.join(' ');

    if (title) {
      out += ' title="' + title + '"';
    }

    out += iframe ? '></iframe>' :
           xhtml ? '/>' :
           '>';

    return out;
  }
};
