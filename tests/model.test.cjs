'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const model = require('../block/editor.js');
const metadata = require('../block/block.json');

test('updating one card retains siblings and never mutates the source', () => {
    const source = Object.freeze([Object.freeze({ title: 'First' }), Object.freeze({ title: 'Second' })]);
    const changed = model.update(source, 0, { title: 'Changed', url: 'https://example.com' });
    assert.equal(changed[0].title, 'Changed');
    assert.equal(source[0].title, 'First');
    assert.strictEqual(changed[1], source[1]);
});
test('new cards have independent state and all editable fields', () => {
    const a = model.add([]), b = model.add([]);
    assert.deepEqual(a[0], { title: '', description: '', tags: '', url: '' });
    assert.notStrictEqual(a[0], b[0]);
});
test('adding is capped at six projects', () => {
    let projects = [];
    for (let i = 0; i < 10; i++) projects = model.add(projects);
    assert.equal(projects.length, 6);
});
test('reordering preserves content and does not mutate the source', () => {
    const source = [{ title: 'A' }, { title: 'B' }, { title: 'C' }];
    assert.deepEqual(model.move(source, 1, -1).map((p) => p.title), ['B', 'A', 'C']);
    assert.deepEqual(model.move(source, 1, 1).map((p) => p.title), ['A', 'C', 'B']);
    assert.deepEqual(source.map((p) => p.title), ['A', 'B', 'C']);
});
test('boundary moves and invalid directions are ignored', () => {
    const source = [{ title: 'A' }, { title: 'B' }];
    for (const args of [[0, -1], [1, 1], [-1, 1], [9, -1], [0, 4]]) assert.deepEqual(model.move(source, ...args), source);
});
test('remove handles the final card and invalid indexes', () => {
    assert.deepEqual(model.remove([{ title: 'A' }], 0), []);
    assert.deepEqual(model.remove([{ title: 'A' }], 99), [{ title: 'A' }]);
});
test('malformed input is normalized to an empty list', () => {
    assert.deepEqual(model.list(null), []);
    assert.deepEqual(model.list({ title: 'bad' }), []);
    assert.equal(model.list(Array(12).fill({})).length, 6);
});
test('column counts are rounded and bounded', () => {
    for (const [input, expected] of [[-1, 1], [8, 3], [2.6, 3], ['2', 2], [undefined, 1]]) assert.equal(model.columns(input), expected);
});
test('tags trim blanks, preserve zero and cap at eight', () => {
    assert.deepEqual(model.tags(' PHP, , React ,0 '), ['PHP', 'React', '0']);
    assert.equal(model.tags(Array(12).fill('PHP').join(',')).length, 8);
    assert.deepEqual(model.tags(null), []);
});
test('metadata points to real assets and uses the tested limits', () => {
    assert.equal(metadata.apiVersion, 3);
    assert.equal(metadata.name, 'umesh/project-showcase');
    for (const key of ['editorScript', 'style', 'editorStyle', 'render']) {
        assert.ok(fs.existsSync(path.join(__dirname, '../block', metadata[key].replace('file:', ''))));
    }
    assert.ok(metadata.attributes.projects.default.length <= model.MAX_PROJECTS);
    assert.equal(metadata.attributes.columns.default, 3);
});
