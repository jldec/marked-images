/**
 * marked-images.js
 *
 * image extensions for marked.js
 * generate width="a" and height="b" attributes from axb pattern in title string E.g ![](src "100x50")
 *          attr="x" from attr=x (with no "") e.g. ![](src "width=100 height=50 align=right")
 *          vimeo standard <iframe.. ></iframe> from ![](vimeo/nnn) where nnn is the vimeo id
 *
 * usage: imgRenderer = markedImage(renderer)
 *
 * original function: copyright Christopher Jeffrey -- https://github.com/chjj/marked/ (MIT License)
 * extension copyright 2015, Jurgen Leschner - github.com/jldec/ - MIT license
 *
**/

module.exports = function markedImage(renderer) {

  renderer.image = function image(href, title, text) {

    var out, iframe;

    if (renderer.options.fqImages && /^\//.test(href)) { href = renderer.options.fqImages + href; }

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
      if (m = w.match(/^(\d+)x(\d+)$/)) return (out += ' width="' + m[1] + '" height="' + m[2] + '"');
      if (m = w.match(/^(\w+)=(\w+)$/)) return (out += ' ' + m[1] + '="' + m[2] + '"');
      if (w) return b.push(w);
    })
    title = b.join(' ');

    if (title) {
      out += ' title="' + title + '"';
    }

    out += iframe ? '></iframe>' :
           renderer.options.xhtml ? '/>' :
           '>';

    return out;
  }

  return renderer;
}
