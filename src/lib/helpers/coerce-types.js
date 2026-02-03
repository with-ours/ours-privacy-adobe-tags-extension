'use strict';

/**
 * Coerces string values to their proper types (number, boolean, null, undefined).
 * Recursively processes objects and arrays.
 *
 * Conversion rules:
 * - Numbers: "123" -> 123, "123.45" -> 123.45, "-123" -> -123
 * - Booleans: "true" -> true, "false" -> false (case-insensitive)
 * - Null: "null" -> null (case-insensitive)
 * - Undefined: "undefined" -> undefined (case-insensitive)
 * - Empty string: "" -> undefined (omitted)
 * - Strings that don't match: kept as-is
 *
 * @param {*} value - Value to coerce
 * @returns {*} Coerced value with proper types
 */
function coerceTypes(value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(coerceTypes);
  }

  if (typeof value === 'object') {
    var coerced = {};
    for (var key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        var coercedValue = coerceTypes(value[key]);
        if (coercedValue !== undefined) {
          coerced[key] = coercedValue;
        }
      }
    }
    return coerced;
  }

  if (typeof value === 'string') {
    var trimmed = value.trim();

    if (trimmed === '') {
      return undefined;
    }

    var lower = trimmed.toLowerCase();
    if (lower === 'true') return true;
    if (lower === 'false') return false;
    if (lower === 'null') return null;
    if (lower === 'undefined') return undefined;

    var hasLeadingTrailingSpaces = value !== trimmed;
    if (!hasLeadingTrailingSpaces) {
      var numberRegex = /^-?\d+(\.\d+)?$/;
      if (numberRegex.test(trimmed)) {
        var num = Number(trimmed);
        if (!isNaN(num) && isFinite(num)) {
          return num;
        }
      }
    }

    return value;
  }

  return value;
}

module.exports = coerceTypes;
