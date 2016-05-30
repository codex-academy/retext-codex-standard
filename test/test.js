'use strict';

/* eslint-env node */
/* jscs:disable maximumLineLength */

/*
 * Dependencies.
 */

var tap = require('tap');
var retext = require('retext');
var codex = require('../lib/standard');
var stripLiquid = require('../lib/strip_liquid');

/*
 * Helpers.
 */

/**
 * Helper to get warnings from `equality` in `doc`.
 *
 * @param {string} doc - Document to process.
 * @return {Array.<VFileMessage>} - Virtual messages.
 */
function process(doc) {
    return codex(doc).messages.map(String);
}

/*
 * Tests.
 */

tap.test('retext-codex', function (t) {
    var doc;

    t.same(
        process('This is basically how to do it'),
        ['1:9-1:18: Remove “basically”'],
        'forbidden'
    );

    t.same(
        process('We work at codex'),
        ['1:12-1:17: Replace “codex” with “codeX”'],
        'codex (wrong)'
    );

    t.same(
        process('We work at codeX'),
        [],
        'codeX (correct)'
    );

    t.same(
        process('We will be using ExpressJS or Express JS'),
        ['1:18-1:27: Replace “ExpressJS” with “Express”',
        '1:31-1:41: Replace “Express JS” with “Express”'],
        'express'
    );

    t.same(
        process('We push code to github'),
        ['1:17-1:23: Replace “github” with “GitHub”'],
        'github (wrong)'
    );

    t.same(
        process('We push code to GitHub'),
        [],
        'GitHub (correct)'
    );

    t.same(
        process('html is for content'),
        ['1:1-1:5: Replace “html” with “HTML”'],
        'HTML'
    );

    t.same(
      process('css is for presentation'),
      ['1:1-1:4: Replace “css” with “CSS”'],
      'CSS'
    );

    t.same(
      process('Javascript is for behaviour'),
      ['1:1-1:11: Replace “Javascript” with “JavaScript”'],
      'JavaScript'
    );

    t.same(
        process('This is `json` and\n some `png`'),
        [],
        'avoid code'
    );

    t.same(
      process('Now deploy your node js app to digital ocean'),
      ['1:17-1:24: Replace “node js” with “Node.JS”',
      '1:32-1:45: Replace “digital ocean” with “DigitalOcean”'],
      'deployment'
    );

    t.same(
        process('This is a length of text'),
        [],
        'no length bug'
    );

    t.same(
        process('{% highlight json %}OSM{% endhighlight %} other text'),
        [],
        'bad text in a liquid tag'
    );

    t.same(
        stripLiquid('{% highlight json %}\nfoo\n{% endhighlight %} other text'),
        '....................\n...\n.................. other text',
        'strip liquid tag'
    );

    t.same(
        stripLiquid('{% highlight json %}foo{% endhighlight %}\n{% highlight json %}foo{% endhighlight %}'),
        '.........................................\n.........................................',
        'strip liquid tag'
    );

    t.end();
});
