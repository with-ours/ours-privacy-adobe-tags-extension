'use strict';

/**
 * Converts an array of {key, value} pairs to a plain object.
 * Skips entries with missing keys or undefined/empty values.
 *
 * In Adobe Tags, data element tokens (%dataElement%) are resolved
 * automatically by the runtime before settings reach the action module,
 * so no variable resolution is needed here.
 *
 * @param {Array} tableField - Array of {key, value} objects
 * @returns {Object} Object built from key-value pairs
 */
module.exports = function buildObjectFromTable(tableField) {
  var obj = {};

  if (!tableField || !Array.isArray(tableField)) {
    return obj;
  }

  for (var i = 0; i < tableField.length; i++) {
    var pair = tableField[i];

    if (!pair || typeof pair !== 'object') {
      continue;
    }

    var key = pair.key;
    var value = pair.value;

    if (!key) {
      continue;
    }

    if (value !== undefined && value !== '') {
      obj[key] = value;
    }
  }

  return obj;
};
