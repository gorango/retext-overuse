'use strict';

var keys = require('object-keys');
var visit = require('unist-util-visit');
var difference = require('array-differ');
var nlcstToString = require('nlcst-to-string');
var quotation = require('quotation');
var search = require('nlcst-search');
var normalize = require('nlcst-normalize');

var stopwords = require('stopwords').english;
var thesaurus = require('thesaurus/lib/th_en_US_new');

function attacher(processor, options) {
  var ignore = (options || {}).ignore || stopwords;
  var patterns = (options || {}).list || thesaurus;
  var limit = (options || {}).limit || 3;
  var list = keys(patterns);
  var phrases = difference(list, ignore);

  function transformer(tree, file) {
    var duplicates = {}
    search(tree, phrases, function(match, position, parent, phrase) {
      duplicates[phrase] = duplicates[phrase] ? duplicates[phrase] + 1 : 1
    });


    var duplicate;
    for (duplicate in duplicates) {
      if (duplicates[duplicate] < limit) {
        delete duplicates[duplicate]
      }
    }

    var duplicateKeys = keys(duplicates);

    search(tree, duplicateKeys, function(match, position, parent, phrase) {

      var suggestions = patterns[phrase];
      var value = quotation(nlcstToString(match), '“', '”');

      var reason = 'Replace ' + value + ' with ' +
      quotation(suggestions, '“', '”').join(', ');

      var message = file.warn(reason, {
        'start': match[0].position.start,
        'end': match[match.length - 1].position.end
      });

      message.ruleId = phrase;
      message.source = 'retext-overuse';

    });

  }

  return transformer;
}

module.exports = attacher;
