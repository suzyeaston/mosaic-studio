const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('../core');
test('timer formats predictable times', () => {
  assert.equal(core.formatTime(0), '00:00');
  assert.equal(core.formatTime(75.9), '01:15');
  assert.equal(core.formatTime(-3), '00:00');
});
test('grid layout forbids losing recorded tiles', () => {
  assert.equal(core.canChangeGrid(4, [0, 2, 3]), true);
  assert.equal(core.canChangeGrid(4, [0, 4]), false);
  assert.equal(core.canChangeGrid(9, [8]), true);
  assert.equal(core.canChangeGrid(9, [9]), false);
});
test('loop phase wraps and rejects bad duration', () => {
  assert.equal(core.expectedPosition(17.3, 15), 2.3000000000000007);
  assert.equal(core.expectedPosition(4, 0), 0);
});
test('clip MIME and safe output names', () => {
  assert.equal(core.chooseMime(['a', 'b'], t => t === 'b'), 'b');
  assert.equal(core.chooseMime(['a'], () => false), '');
  assert.equal(core.safeFileName(' a <song> #1 '), 'a-song-1');
});

test('planning target does not cap elapsed recording time', () => {
  assert.deepEqual(core.DURATIONS, [0, 15, 30, 60, 120]);
  assert.equal(core.targetProgress(7, 15), 46.666666666666664);
  assert.equal(core.targetProgress(30, 15), 100);
  assert.equal(core.targetProgress(30, 0), 0);
});
test('session duration comes from the longest recorded take, not the target', () => {
  assert.equal(core.sessionSeconds([{seconds: 7}, {seconds: 22.7}]), 22.7);
  assert.equal(core.sessionSeconds([]), 0);
  assert.equal(core.sessionSeconds([{seconds: NaN}, {seconds: -2}]), 0);
  assert.equal(core.expectedPosition(23, core.sessionSeconds([{seconds: 7}, {seconds: 22.7}])).toFixed(1), '0.3');
});
