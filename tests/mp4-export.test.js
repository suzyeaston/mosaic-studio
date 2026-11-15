'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const core = require('../core.js');
const read = filename => fs.readFileSync(path.join(__dirname,'..',filename),'utf8');

test('social export prefers MP4 H.264/AAC candidates before WebM', () => {
  assert.equal(core.chooseSocialVideoMime(() => true), core.SOCIAL_VIDEO_MIMES[0]);
  assert.match(core.SOCIAL_VIDEO_MIMES[0], /^video\/mp4;codecs=avc1\./);
  assert.match(core.SOCIAL_VIDEO_MIMES[0], /mp4a\.40\.2/);
  assert.equal(core.chooseSocialVideoMime(x => x === 'video/mp4'), 'video/mp4');
  assert.equal(core.chooseSocialVideoMime(x => x.startsWith('video/webm')), 'video/webm;codecs=vp8,opus');
  assert.equal(core.chooseSocialVideoMime(() => false), '');
});

test('file extension must reflect the actual container, never an alias', () => {
  assert.equal(core.videoExtension('video/mp4;codecs=avc1.424028,mp4a.40.2'), 'mp4');
  assert.equal(core.videoExtension('video/webm;codecs=vp8,opus'), 'webm');
  assert.equal(core.videoExtension('video/quicktime'), '');
  assert.equal(core.videoExtension(''), '');
  assert.equal(core.videoExtension('audio/mp4'), '');
});

test('MP4 priority applies only to the final composite, not source capture', () => {
  const app = read('app.js');
  const html = read('index.html');
  assert.match(app, /const mime = recMime\(!input\.audioOnly\)/);
  assert.match(app, /rec = makeSocialRecorder\(outputStream\)/);
  assert.match(app, /for \(const type of core\.SOCIAL_VIDEO_MIMES\)/);
  assert.match(app, /const type = rec\.mimeType \|\| ''/);
  assert.match(app, /const extension = core\.videoExtension\(type\)/);
  assert.match(app, /const name = `mosaic-.*\.\$\{extension\}`/);
  assert.match(html, /id="export-format-note"/);
  assert.match(html, /MP4 PREFERRED/);
});
