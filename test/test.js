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
        process('We used OSM, Open Street Map, and Open Street Maps'),
        ['1:9-1:12: Replace “OSM” with “OpenStreetMap”',
        '1:14-1:29: Replace “Open Street Map” with “OpenStreetMap”',
        '1:35-1:51: Replace “Open Street Maps” with “OpenStreetMap”'],
        'OSM'
    );

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
        process('Upload a TIF'),
        ["1:10-1:13: Replace “TIF” with “TIFF”"],
        'TIFF not TIF'
    );

    t.same(
        process('This is `json` and\n some `png`'),
        [],
        'avoid code'
    );

    t.same(
        process('This is a length of text'),
        [],
        'no length bug'
    );

    t.same(
        process('This endpoint returns geoJSON'),
        ['1:23-1:30: Replace “geoJSON” with “GeoJSON”'],
        'OSM'
    );

    t.same(
        process('\nThis endpoint returns geoJSON'),
        ['2:23-2:30: Replace “geoJSON” with “GeoJSON”'],
        'geoJSON'
    );

    t.same(
        process('This endpoint returns `geojson`'),
        [],
        'geojson in code'
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
