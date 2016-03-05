/**
 * @author Duncan Beaton
 * @copyright 2016 Duncan Beaton
 * @license MIT
 * @module retext:overuse
 * @fileoverview Check phrases overuse.
 */

'use strict';

/* eslint-env node */

/*
 * Dependencies.
 */

var test = require('tape');
var retext = require('retext');
var overuse = require('./');

/*
 * Tests.
 */

test('retext-overuse', function(t) {
  t.plan(2);

  retext()
    .use(overuse)
    .process([
      'That movie was amazing',
      'The acting was amazing',
      'The story was amazing',
    ].join('\n'), function(err, file) {

      t.ifError(err, 'should not fail (#1)');

      t.deepEqual(
        file.messages.map(String), [
          '1:16-1:23: Replace “amazing” with “astonishing”, “surprising”, “awe-inspiring”, “awesome”, “awful”, “awing”, “impressive”', 
          '2:16-2:23: Replace “amazing” with “astonishing”, “surprising”, “awe-inspiring”, “awesome”, “awful”, “awing”, “impressive”', 
          '3:15-3:22: Replace “amazing” with “astonishing”, “surprising”, “awe-inspiring”, “awesome”, “awful”, “awing”, “impressive”'
        ],
        'should warn about the use of overused words'
      );

    });

});
