'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const sound=require('../soundbank.js'),inst=require('../instruments.js'),timeline=require('../timeline.js');
const source=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');

test('Sound browser has two distinct, labelled patches per instrument and drum family',()=>{
  assert.deepEqual(Object.keys(sound.SOUNDS),['keys','bass','pad','drums']);
  for(const list of Object.values(sound.SOUNDS)){
    assert.equal(list.length,2);
    assert.ok(list.every(p=>p.id&&p.label&&p.description));
  }
  assert.equal(sound.defaultVoice('pad'),'pad-silk');
  assert.equal(sound.soundFor('pad','pad-air').id,'pad-air');
  assert.equal(sound.soundFor('pad','nonsense').id,'pad-silk');
  assert.equal(inst.defaultVoice('bass'),'bass-round');
});

test('Old saved layers still load and default to the new warm patch',()=>{
  const layer=inst.normalizeLayer({id:'old',kind:'pad',seconds:8,events:[{t:0,note:52,dur:.8}]});
  assert.equal(layer.voice,'pad-silk');
  const modified=inst.normalizeLayer({...layer,voice:'pad-air'});
  assert.equal(modified.voice,'pad-air');
  assert.equal(inst.eventsInWindow(modified,0,1)[0].voice,'pad-air');
  assert.equal(inst.normalizeLayer({...layer,voice:'unsafe-id'}).voice,'pad-silk');
});

test('Loop preview never touches stored instrument layers or composite mix',()=>{
  const s=source('instruments.js'),app=source('app.js'),html=source('index.html');
  assert.match(s,/async preview\(mode\)/);
  assert.match(s,/this\.previewTimer=this\.host\.setInterval\(schedule,30\)/);
  assert.match(s,/output\.connect\(ctx\.destination\)/);
  assert.doesNotMatch(s,/output\.connect\(this\.exportBus\)/);
  assert.match(s,/this\.onPreviewStart\?\.\(\)/);
  assert.match(s,/stopPreview\(\)/);
  assert.match(app,/onPreviewStart:/);
  assert.match(html,/id="instrument-preview-loop"/);
  assert.match(html,/id="instrument-preview-rhythm"/);
  assert.match(html,/src="soundbank\.js"/);
});

test('iMovie-like timeline repeats individual audio/video clips and derives note markers',()=>{
  const a=timeline.segments(2,7);
  assert.deepEqual(a.map(x=>[x.start,x.seconds]),[[0,2],[2,2],[4,2],[6,1]]);
  const many=timeline.segments(.1,20);
  assert.ok(many.length<=24);
  assert.ok(many[many.length-1].skipped>0);
  const lanes=timeline.makeLanes([{index:1,seconds:5,audioOnly:false,muted:false}],
    [{id:'id1',kind:'pad',voice:'pad-silk',seconds:2,events:[{t:.5,note:60,dur:.3}]}],6);
  assert.equal(lanes.length,2);
  assert.equal(lanes[0].name,'TAKE 02');
  assert.equal(lanes[1].type,'instrument');
  assert.equal(lanes[1].notes[0].left,25);
  assert.equal(lanes[1].segments.length,3);
  assert.match(source('app.js'),/updateTimelinePlayhead\(position\)/);
  assert.match(source('index.html'),/id="mosaic-arrangement-tracks"/);
});
