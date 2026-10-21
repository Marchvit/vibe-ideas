import { test } from 'node:test';
import assert from 'node:assert/strict';
import { merge, parse } from './merge.js';

test('merge: свежая версия побеждает, новые добавляются, новые сверху', () => {
  const mine = [
    { text: 'A', status: 'idea', created: 1, updated: 5 },
    { text: 'B', status: 'idea', created: 2, updated: 2 },
  ];
  const theirs = [
    { text: 'A old', status: 'idea', created: 1, updated: 3 },
    { text: 'B new', status: 'done', created: 2, updated: 9 },
    { text: 'C', status: 'work', created: 3, updated: 3 },
  ];
  assert.deepEqual(merge(mine, theirs).map(i => i.text), ['C', 'B new', 'A']);
});

test('parse: выкидывает битые записи, не принимает не-список', () => {
  assert.deepEqual(parse('[{"text":"ok","status":"idea","created":1},{"text":5},null]'), [
    { text: 'ok', status: 'idea', created: 1, updated: 1, deleted: false },
  ]);
  assert.throws(() => parse('{}'));
  assert.throws(() => parse('not json'));
});

test('merge: удаление новее правки — идея остаётся удалённой', () => {
  const mine = [{ text: '', status: 'idea', created: 1, updated: 9, deleted: true }];
  const theirs = [{ text: 'A', status: 'idea', created: 1, updated: 5, deleted: false }];
  assert.equal(merge(mine, theirs)[0].deleted, true);
});
