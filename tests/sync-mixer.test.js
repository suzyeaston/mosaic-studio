'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');
const core=require('../core.js');
const inst=require('../instruments.js');
const timeline=require('../timeline.js');

test('Bar grid is stable for 1/2/4-bar loops and arbitrary start times',()=>{
  assert.equal(core.barSeconds(120),2);
  assert.equal(core.barSeconds(60),4);
  assert.equal(core.nextBarBoundary(14.8,120),16);
  assert.equal(core.nextBarBoundary(8.01,120),10);
  assert.equal(core.nextBarBoundary(0,120),2);
  assert.equal(core.stopAtNextBar(14.8,120).toFixed(1),'1.2');
  assert.equal(core.barSeconds('invalid'),2);
});

test('New note layers carry their own arming offset and preserve old clip compatibility',()=>{
  const base={id:'a',kind:'bass',voice:'bass-round',seconds:8,
    events:[{t:0,note:40,dur:.5},{t:4,note:43,dur:.5}],muted:false,volume:.8};
  assert.equal(inst.normalizeLayer(base).startAt,0);
  const shifted=inst.normalizeLayer({...base,startAt:2});
  assert.equal(shifted.startAt,2);
  assert.deepEqual(inst.eventsInWindow(shifted,0,1),[]);
  assert.deepEqual(inst.eventsInWindow(shifted,1.9,2.1).map(e=>e.t),[2]);
  assert.deepEqual(inst.eventsInWindow(shifted,9.9,10.1).map(e=>e.t),[10]);
  assert.equal(timeline.makeLanes([],[shifted],10)[0].segments[0].start,2);
});

test('Main transport uses one audio epoch for synth scheduling and video capture',()=>{
  const app=read('app.js');
  const beforeVideo=app.slice(app.indexOf('async function startTake()'),app.indexOf('function stopTake(keep)'));
  assert.ok(beforeVideo.indexOf("await startPlayback('recording')")>=0);
  assert.ok(beforeVideo.indexOf("await startPlayback('recording')")<beforeVideo.indexOf("activeRecorder.start(250)"));
  assert.match(app,/transportAudioOrigin = audioContext\.currentTime/);
  assert.match(app,/audioScheduleId=setInterval\(\(\)=>\{/);
  assert.match(app,/core\.nextBarBoundary\(elapsed,takeSyncBpm\)/);
  assert.match(app,/takeLoopSeconds \|\| Math\.max\(/);
  assert.match(app,/instrumentRack\.begin\(\{clock:transportSeconds,bpm:arrangementBpm\(\)\}\)/);
  assert.match(app,/const layer = instrumentRack\.finish\(\);\s*stopPlayback\(\)/);
});

test('Live mixer allows continuous audio-only looping and repeat auditions',()=>{
  const html=read('index.html');
  const app=read('app.js');
  const rack=read('instruments.js');
  assert.match(html,/id="loop-toggle"/);
  assert.match(html,/id="loop-status"/);
  assert.match(html,/class="instrument-mixer-details"/);
  assert.match(app,/ui\.loopToggle\?\.addEventListener\('click'/);
  assert.match(app,/reason==='added'&&/);
  assert.match(rack,/this\.onChange\('added'\)/);
  assert.match(rack,/this\.previewTimer=this\.host\.setInterval\(schedule,30\)/);
  assert.match(rack,/this\.host\.clearInterval\(this\.previewTimer\)/);
  assert.match(rack,/Math\.ceil\(\(elapsed\+\.25\)\/bar\)\*bar/);
});
