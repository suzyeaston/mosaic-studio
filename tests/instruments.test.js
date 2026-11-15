'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const source=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const synth=require('../instruments.js');
test('Three original SUZY//AI-derived browser instruments and playable note mapping',()=>{
  assert.deepEqual(synth.KINDS,['keys','bass','pad']);
  assert.deepEqual(synth.OFFSETS,[0,2,4,5,7,9,11,12]);
  assert.equal(synth.KEYBOARD,'asdfghjk');
  assert.equal(Math.round(synth.frequency(69)),440);
  assert.equal(synth.pitch('bass',0),48);
  assert.equal(synth.pitch('keys',0),60);
});
test('Reject malformed saved layers; retain only bounded note events',()=>{
  const base={id:'a',kind:'keys',seconds:2,events:[{t:.25,note:60,dur:.5}],volume:.8};
  assert.equal(synth.normalizeLayer({...base,kind:'fake'}),null);
  assert.equal(synth.normalizeLayer({...base,events:[]}),null);
  assert.equal(synth.normalizeLayer({...base,seconds:0}),null);
  assert.equal(synth.normalizeLayer({...base,events:[{t:9,note:60,dur:.5}]}),null);
  assert.equal(synth.normalizeLayer({...base,volume:999}).volume,1.5);
});
test('Instrument notes loop independently along the common performance timeline',()=>{
  const layer={kind:'keys',seconds:2,muted:false,volume:.8,events:[{t:.5,note:60,dur:.4}]};
  assert.deepEqual(synth.eventsInWindow(layer,0,5).map(e=>e.t),[.5,2.5,4.5]);
  assert.deepEqual(synth.eventsInWindow({...layer,muted:true},0,5),[]);
  assert.deepEqual(synth.eventsInWindow(layer,2.6,4.4),[]);
});
test('Instrument mix participates in playback, recording monitor and composite export',()=>{
  const app=source('app.js'),html=source('index.html');
  assert.match(app,/instrumentRack\?\.tick\(elapsed\)/);
  assert.match(app,/instrumentRack\?\.connectExport\(exportDestination\)/);
  assert.match(app,/instrumentRack\?\.disconnectExport\(\)/);
  assert.match(app,/instrumentRack\?\.startPlayback\(\)/);
  assert.match(app,/instrumentRack\.finish\(\)/);
  assert.match(app,/hasArrangement\(\)/);
  assert.match(html,/src="instruments\.js"/);
  assert.match(html,/id="instrument-record"/);
  assert.match(html,/id="instrument-pads"/);
});
