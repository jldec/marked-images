# marked-images
![CI](https://github.com/jldec/marked-images/workflows/CI/badge.svg)

Simple [marked renderer](https://marked.js.org/#/USING_PRO.md#renderer) to include image attributes in markdown.
Also generates vimeo links.

## installation

```sh
npm install marked-images
```

## usage

```javascript
var marked = require('marked');
var renderer = new marked.Renderer();

require('marked-images')(renderer);    // monkey-patches the renderer

var html = marked(markdown, {renderer:renderer});
```

#### simple width and height
{number}x{number} in the title text part of the link in quotes after the url e.g.

```md
![](src "1x2 title text")
or
![](src "title text 1x2")
```

generates:
```html
<img src="src" alt="" width="1" height="2" title="title text">
```

#### explicit attributes
any attribute name=value, no quotes around the value e.g.

```md
![](src "width=1 height=2 align=right title text")
```

generates:
```html
<img src="src" alt="" width="1" height="2" align="right" title="title text">
```

#### vimeo link
start src with 'vimeo/' e.g.

```md
![](vimeo/00000000 "500x281")
```

generates:
```html
<iframe src="//player.vimeo.com/video/00000000" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen width="500" height="281"></iframe>
```

