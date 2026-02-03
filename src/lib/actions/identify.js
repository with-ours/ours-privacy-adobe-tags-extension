'use strict';

var reactorWindow = require('@adobe/reactor-window');
var ensureOursFunction = require('../helpers/ensure-ours-function');
var buildObjectFromTable = require('../helpers/build-object-from-table');
var coerceTypes = require('../helpers/coerce-types');

/**
 * Identifies a user with the provided properties via the Ours Privacy SDK.
 *
 * @param {Object} settings - Action settings from the Adobe Tags UI
 * @param {Array} settings.userProperties - Array of {key, value} user attributes
 */
module.exports = function (settings) {
  var ours = ensureOursFunction(reactorWindow);

  var userProperties = coerceTypes(buildObjectFromTable(settings.userProperties));

  if (!userProperties || Object.keys(userProperties).length === 0) {
    turbine.logger.error(
      'Ours Privacy Identify: At least one user property is required.'
    );
    return;
  }

  ours('identify', userProperties);

  turbine.logger.log('Ours Privacy: Identified user.');
};
