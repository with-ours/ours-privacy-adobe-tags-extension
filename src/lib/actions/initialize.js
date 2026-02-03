'use strict';

var reactorWindow = require('@adobe/reactor-window');
var loadScript = require('@adobe/reactor-load-script');
var ensureOursFunction = require('../helpers/ensure-ours-function');

var SDK_URL = 'https://cdn.oursprivacy.com/main.js';

/**
 * Loads the Ours Privacy SDK and initializes it with the project token
 * from the extension configuration.
 *
 * The ensureOursFunction helper creates a stub queue so that any
 * track/identify calls made before the SDK finishes loading are
 * queued and replayed automatically once the SDK initializes.
 */
module.exports = function (settings) {
  var extensionSettings = turbine.getExtensionSettings();
  var token = extensionSettings.token;

  if (!token) {
    turbine.logger.error(
      'Ours Privacy: Project token is required. Configure it in the extension settings.'
    );
    return;
  }

  // Create stub queue so calls before SDK loads are captured
  var ours = ensureOursFunction(reactorWindow);

  // Load the SDK script from CDN
  loadScript(SDK_URL).then(function () {
    turbine.logger.log('Ours Privacy: SDK loaded successfully.');
  });

  // Call init — if SDK is still loading, the stub queues this call
  // and the SDK replays it once loaded
  ours('init', token);

  turbine.logger.log('Ours Privacy: Initialized with token.');
};
