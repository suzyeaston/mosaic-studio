'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const patterns=require('../patterns.js'),synth=require('../instruments.js');
const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');

test('Loop library exposes three rhythm loops plus bass, keys and pad, not audio samples',()=>{
  assert.deepEqual(patterns.PRESETS.map(p=>p.id),
    ['heartbeat','broken','half-time','sub-walk','glass-circuit','soft-orbit']);
  assert.deepEqual(patterns.PRESETS.map(p=>p.kind),['drums','drums','drums','bass','keys','pad']);
  assert.equal(patterns.safeTempo(999),200);
  assert.equal(patterns.safeTempo('not-a-number'),120);
  assert.equal(patterns.safeBars(9),4);
  assert.equal(patterns.buildPreset('unknown',120,4),null);
});

test('Ready-made loop is a real repeating 4/4 musical event layer',()=>{
  const beat=patterns.buildPreset('heartbeat',120,4);
  assert.equal(beat.seconds,8);
  assert.equal(beat.kind,'drums');
  assert.equal(beat.source,'preset');
  assert.ok(beat.events.length>40);
  assert.ok(beat.events.some(ev=>ev.note===36&&ev.t===0));
  assert.ok(beat.events.some(ev=>ev.note===38&&ev.t===.5));
  assert.ok(beat.events.every(ev=>ev.t>=0&&ev.t<8));
  const normalized=synth.normalizeLayer(beat);
  assert.equal(normalized.name,'Rhythm · Harbour Pulse');
  assert.equal(normalized.bpm,120);
  const window=synth.eventsInWindow(normalized,8,8.13);
  assert.ok(window.some(ev=>ev.note===36&&ev.t===8));
});

test('Build-a-beat toggles precisely 16 steps, protects against invalid steps',()=>{
  const steps=patterns.validateSteps({kick:[0,0,8,-1,16,'7'],snare:[4,12],hat:[0,2]});
  assert.deepEqual(steps.kick,[0,8]);
  const custom=patterns.buildPreset('custom-rhythm',120,2,steps);
  assert.equal(custom.seconds,4);
  assert.equal(custom.kind,'drums');
  assert.equal(custom.source,'custom-rhythm');
  assert.equal(custom.events.filter(e=>e.note===36).length,4);
  assert.equal(patterns.buildPreset('custom-rhythm',120,2,{kick:[],snare:[],hat:[]}),null);
});

test('All six presets stay bounded and use source-agnostic Web Audio synthesis',()=>{
  for(const p of patterns.PRESETS){
    const loop=patterns.buildPreset(p.id,120,4);
    assert.ok(loop.events.length>0,p.id);
    assert.ok(loop.events.every(e=>e.t>=0&&e.t<loop.seconds&&e.dur>0),p.id);
    assert.ok(synth.normalizeLayer(loop),p.id);
  }
  assert.match(fs.readFileSync(path.join(__dirname,'../instruments.js'),'utf8'),/if\(kind==='drums'\)return percussion/);
  assert.match(app,/instrumentRack\?\.connectExport\(exportDestination\)/);
  assert.match(html,/src="patterns\.js"/);
  assert.match(html,/id="instrument-step-grid"/);
  assert.match(html,/id="instrument-add-loop"/);
});
