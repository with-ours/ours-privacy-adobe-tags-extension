'use strict';

/**
 * Ensures window.ours function exists, creating a stub queue if needed.
 * This allows actions to queue calls even if the SDK hasn't loaded yet.
 * When the SDK loads, it will process the existing queue.
 *
 * @param {Object} windowObj - The window object (from @adobe/reactor-window)
 * @returns {Function} The ours function (either existing or newly created stub)
 */
module.exports = function ensureOursFunction(windowObj) {
  if (windowObj.ours && typeof windowObj.ours === 'function') {
    return windowObj.ours;
  }

  if (!windowObj.ours) {
    var queue = [];

    windowObj.ours = function () {
      queue.push(Array.prototype.slice.call(arguments));
    };

    windowObj.ours.queue = queue;
    windowObj.ours.version = '1.0';
  } else if (!windowObj.ours.queue) {
    windowObj.ours.queue = [];
    windowObj.ours.version = windowObj.ours.version || '1.0';
  }

  return windowObj.ours;
};
