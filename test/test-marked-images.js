/**
 * test-markedext
 * tests for marked-images plugin
 * Copyright (c) 2015-2024 Jürgen Leschner - github.com/jldec - MIT license
 *
**/
/*eslint indent: "off"*/

var test = require('tape');

var inspect = require('util').inspect;
var marked = require('marked');
var markedImages = require('../marked-images');
marked.use(markedImages());

var tests = [

{comment: ' *** Test image width and height extension ***',
 in:'![](src)',
out:'<img src="src" alt="">'}
,
{in:'![alt text](src)',
out:'<img src="src" alt="alt text">'}
,
{in:'![](src "")',
out:'<img src="src" alt="">'}
,
{in:'![](src " ")',
out:'<img src="src" alt="">'}
,
{in:'![](src "title text")',
out:'<img src="src" alt="" title="title text">'}
,
{in:'![](src "1x2 title text")',
out:'<img src="src" alt="" width="1" height="2" title="title text">'}
,
{in:'![](src " 1x2 title text")',
out:'<img src="src" alt="" width="1" height="2" title="title text">'}
,
{in:'![](src "title 1x2 text")',
out:'<img src="src" alt="" width="1" height="2" title="title text">'}
,
{in:'![](src "title text 1x2 ")',
out:'<img src="src" alt="" width="1" height="2" title="title text">'}
,
{in:'![](src "title text 1x2")',
out:'<img src="src" alt="" width="1" height="2" title="title text">'}
,
{in:'![](src "width=1 height=2 title text")',
out:'<img src="src" alt="" width="1" height="2" title="title text">'}
,
{in:'![](src "class=j_k-22 title text")',
out:'<img src="src" alt="" class="j_k-22" title="title text">'}
,
{in:'![](src "class=j_k-22 title text .foo")',
out:'<img src="src" alt="" class="j_k-22 foo" title="title text">'}
,
{in:'![](src ".class1 .class-2 .class_3 10x10")',
out:'<img src="src" alt="" width="10" height="10" class="class1 class-2 class_3">'}
,
{in:'![](src "width=1 height=2 title text")',
out:'<img src="src" alt="" width="1" height="2" title="title text">'}
,
{in:'![](src "width=1 height=2 align=right title text")',
out:'<img src="src" alt="" width="1" height="2" align="right" title="title text">'}
,
{in:'![](src "10x10 title text")',
out:'<img src="src" alt="" width="10" height="10" title="title text">'}
,
{in:'![](src " 1x1  title text")',
out:'<img src="src" alt="" width="1" height="1" title="title text">'}
,
{in:'![](src " 10x10  title text")',
out:'<img src="src" alt="" width="10" height="10" title="title text">'}
,
{in:'![](src "1 x 1 title text")',
out:'<img src="src" alt="" title="1 x 1 title text">'}
,
{
comment: ' *** Test vimeo iframe extension ***',
in:'![](vimeo/46998258 "500x281")',
out:'<iframe src="//player.vimeo.com/video/46998258" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen width="500" height="281"></iframe>'}

];

// for convenience of writing test cases, unwrap strips paragraph or list markup from around the output
function wrap(s) { return '<p>' + s + '</p>\n'; }
function wrap2(s) { return '<ul>\n<li>' + s + '</li>\n</ul>\n'; }
function unwrap(s) { return (/^<p>/.test(s) ? s.slice(3,-5) : (/^<ul>/.test(s) ? s.slice(9,-12) : s)); }

test('sanity check unwrap()', function(t) {
  t.equal(unwrap('hello'),'hello');
  t.equal(unwrap(wrap('hello')),'hello');
  t.equal(unwrap(wrap2('hello')),'hello');
  t.end();
});

tests.forEach(function(tst){
  test(inspect(tst.in).slice(1,-1) + (tst.comment || ''), function(t){
    var actual = marked.marked(tst.in);
    // console.log('@@@\n%s\n@@@', actual);
    t.equal(unwrap(actual), tst.out);
    t.end();
  });
});
