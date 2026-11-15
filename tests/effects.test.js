'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fx = require('../effects.js');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
test('Video FX include five distinct whole-grid looks with safe input validation', () => {
  assert.deepEqual(fx.PRESETS.map(item => item.id), ['clean', 'noir', 'ultraviolet', 'daydream', 'vhs']);
  assert.equal(fx.preset('nope'), 'clean');
  assert.equal(fx.strength(-3), 0);
  assert.equal(fx.strength(160), 100);
  assert.equal(fx.strength(NaN), 65);
  assert.equal(fx.filterFor('clean', 90), 'none');
  assert.match(fx.filterFor('noir', 90), /grayscale/);
  assert.match(fx.filterFor('ultraviolet', 80), /hue-rotate/);
});
test('Final preview and export both use one effect renderer', () => {
  const app = readFileSync(join(__dirname,'../app.js'),'utf8');
  assert.match(app, /function renderFinalFrame\(/);
  assert.match(app, /renderFinalFrame\(previewContext,/);
  assert.match(app, /renderFinalFrame\(ctx, 720, 720,/);
  assert.match(app, /effects\.draw\(ctx, scratchCanvas,/);
});
test('Native file share requires a completed export and provides download fallback', () => {
  const app = readFileSync(join(__dirname,'../app.js'),'utf8');
  const html = readFileSync(join(__dirname,'../index.html'),'utf8');
  assert.match(app, /navigator\.canShare\?\.\(\{ files: \[file\] \}\)/);
  assert.match(app, /await navigator\.share\(/);
  assert.match(app, /lastExport = \{ blob, name \}/);
  assert.match(app, /downloadBlob\(blob, name\)/);
  assert.match(html, /id="share-caption"/);
  assert.match(html, /src="effects\.js"/);
});
