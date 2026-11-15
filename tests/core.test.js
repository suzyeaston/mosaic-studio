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
