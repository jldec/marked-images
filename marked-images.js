/**
 * marked-images.js
 *
 * marked.js plugin for images
 *
 * looks for href pattern "vimeo/nnn" where nnn is the vimeo id
 * produces <iframe.. ></iframe>
 *
 * splits title into whitespace-separated tokens
 * looks in each token for patterns used to generate <img> or <iframe> attributes
 * - pattern axb E.g ![](src "100x50") => width="100" height="50"
 * - pattern attr=value (with no quotes) E.g. ![](src "width=100 height=50 align=right")
 * - pattern .className E.g. ![](src ".foo .bar") => class="foo bar"
 *
 * usage: marked.use(markedImages(opts))
 *
 * original function: copyright Christopher Jeffrey -- https://github.com/markedjs/marked (MIT License)
 * extension Copyright (c) 2015-2022 Jürgen Leschner - github.com/jldec/ - MIT license
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
    var classNames = [];
    var m;
    a.forEach(function(w) {
      if ((m = w.match(/^(\d+)x(\d+)$/))) return (out += ' width="' + m[1] + '" height="' + m[2] + '"');
      if ((m = w.match(/^(\w+)=([\w-]+)$/))) {
        if (m[1] === 'class') return classNames.push(m[2]);
        return (out += ' ' + m[1] + '="' + m[2] + '"');
      }
      if ((m = w.match(/^\.([\w-]+)$/))) return classNames.push(m[1]);
      if (w) return b.push(w);
    });

    if (classNames.length) {
      out += ' class="' + classNames.join(' ') + '"';
    }

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
