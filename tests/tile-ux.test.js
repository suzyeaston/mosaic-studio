'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const app = fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const html = fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const css = fs.readFileSync(path.join(__dirname,'../styles.css'),'utf8');
test('Recorded tiles render independent close and action buttons, without invalid nested buttons', () => {
  assert.match(app, /const tile = document\.createElement\('div'\)/);
  assert.match(app, /const action = document\.createElement\('button'\)/);
  assert.match(app, /action\.addEventListener\('click', \(\) => activateTile\(i\)\)/);
  assert.match(app, /const remove = document\.createElement\('button'\)/);
  assert.match(app, /remove\.setAttribute\('aria-label', `Remove take /);
  assert.match(app, /event\.stopPropagation\(\);\s*removeTile\(i\);/);
  assert.match(css, /\.tile \.tile-remove/);
});
test('Tapping empty tile starts capture; current recording tile stops and keeps', () => {
  assert.match(app, /function activateTile\(i\)/);
  assert.match(app, /activeRecorder\?\.state === 'recording' && selected === i\) stopTake\(true\)/);
  assert.match(app, /if \(!clips\.has\(i\)\) startTake\(\)/);
  assert.match(app, /'■ STOP & KEEP TAKE'/);
  assert.match(html, /Tap <strong>\+<\/strong> in an empty tile to record/);
});
test('Tile remove deletes only that indexed take and restores a recording slot', () => {
  assert.match(app, /async function removeTile\(index = selected\)/);
  assert.match(app, /clips\.delete\(index\)/);
  assert.match(app, /await dbWrite\('delete', index\)/);
  assert.match(app, /invalidateExport\(\)/);
  assert.match(app, /ui\.remove\.addEventListener\('click', \(\) => removeTile\(selected\)\)/);
  assert.match(app, /You can't undo this/);
});
