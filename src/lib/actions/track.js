'use strict';

var reactorWindow = require('@adobe/reactor-window');
var ensureOursFunction = require('../helpers/ensure-ours-function');
var buildObjectFromTable = require('../helpers/build-object-from-table');
var coerceTypes = require('../helpers/coerce-types');

/**
 * Tracks an event via the Ours Privacy SDK.
 *
 * @param {Object} settings - Action settings from the Adobe Tags UI
 * @param {string} settings.eventName - Name of the event to track
 * @param {Array} [settings.eventProperties] - Array of {key, value} event metadata
 * @param {Array} [settings.userProperties] - Array of {key, value} user attributes
 */
module.exports = function (settings) {
  var ours = ensureOursFunction(reactorWindow);

  var eventName = settings.eventName;
  if (!eventName) {
    turbine.logger.error('Ours Privacy Track: Event name is required.');
    return;
  }

  var eventProperties = coerceTypes(buildObjectFromTable(settings.eventProperties));
  var userProperties = coerceTypes(buildObjectFromTable(settings.userProperties));

  var hasUserProperties = userProperties && Object.keys(userProperties).length > 0;

  if (hasUserProperties) {
    ours('track', eventName, eventProperties, userProperties);
  } else {
    ours('track', eventName, eventProperties);
  }

  turbine.logger.log('Ours Privacy: Tracked event "' + eventName + '".');
};
