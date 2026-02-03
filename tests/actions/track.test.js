import { describe, it, expect, beforeEach, vi } from 'vitest';
import ensureOursFunction from '../../src/lib/helpers/ensure-ours-function.js';
import buildObjectFromTable from '../../src/lib/helpers/build-object-from-table.js';
import coerceTypes from '../../src/lib/helpers/coerce-types.js';

describe('track action', () => {
  var mockWindow;
  var oursCalls;

  beforeEach(() => {
    mockWindow = {};
    oursCalls = [];

    // Pre-populate with a mock ours function that records calls
    mockWindow.ours = function () {
      oursCalls.push(Array.prototype.slice.call(arguments));
    };
    mockWindow.ours.queue = [];
    mockWindow.ours.version = '1.0';

    vi.stubGlobal('turbine', {
      logger: {
        log: vi.fn(),
        error: vi.fn(),
      },
    });
  });

  function runTrack(settings) {
    var ours = ensureOursFunction(mockWindow);

    var eventName = settings.eventName;
    if (!eventName) {
      turbine.logger.error('Ours Privacy Track: Event name is required.');
      return;
    }

    var eventProperties = coerceTypes(
      buildObjectFromTable(settings.eventProperties)
    );
    var userProperties = coerceTypes(
      buildObjectFromTable(settings.userProperties)
    );

    var hasUserProperties =
      userProperties && Object.keys(userProperties).length > 0;

    if (hasUserProperties) {
      ours('track', eventName, eventProperties, userProperties);
    } else {
      ours('track', eventName, eventProperties);
    }

    turbine.logger.log('Ours Privacy: Tracked event "' + eventName + '".');
  }

  it('should call ours track with event name and empty properties', () => {
    runTrack({ eventName: 'page_view' });

    expect(oursCalls).toHaveLength(1);
    expect(oursCalls[0][0]).toBe('track');
    expect(oursCalls[0][1]).toBe('page_view');
    expect(oursCalls[0][2]).toEqual({});
  });

  it('should include event properties when provided', () => {
    runTrack({
      eventName: 'button_click',
      eventProperties: [
        { key: 'button_id', value: 'cta-1' },
        { key: 'page', value: '/pricing' },
      ],
    });

    expect(oursCalls[0][0]).toBe('track');
    expect(oursCalls[0][1]).toBe('button_click');
    expect(oursCalls[0][2]).toEqual({ button_id: 'cta-1', page: '/pricing' });
  });

  it('should include user properties when provided', () => {
    runTrack({
      eventName: 'purchase',
      eventProperties: [{ key: 'amount', value: '99' }],
      userProperties: [{ key: 'plan', value: 'pro' }],
    });

    expect(oursCalls[0][0]).toBe('track');
    expect(oursCalls[0][1]).toBe('purchase');
    expect(oursCalls[0][2]).toEqual({ amount: 99 });
    expect(oursCalls[0][3]).toEqual({ plan: 'pro' });
  });

  it('should not include user properties argument when table is empty', () => {
    runTrack({
      eventName: 'view',
      eventProperties: [],
      userProperties: [],
    });

    expect(oursCalls[0]).toHaveLength(3); // track, eventName, eventProps
  });

  it('should coerce property values to proper types', () => {
    runTrack({
      eventName: 'test',
      eventProperties: [
        { key: 'count', value: '42' },
        { key: 'active', value: 'true' },
        { key: 'label', value: 'hello' },
      ],
    });

    expect(oursCalls[0][2]).toEqual({
      count: 42,
      active: true,
      label: 'hello',
    });
  });

  it('should log an error when event name is missing', () => {
    runTrack({});

    expect(turbine.logger.error).toHaveBeenCalledWith(
      'Ours Privacy Track: Event name is required.'
    );
    expect(oursCalls).toHaveLength(0);
  });

  it('should log an error when event name is empty string', () => {
    runTrack({ eventName: '' });

    expect(turbine.logger.error).toHaveBeenCalled();
    expect(oursCalls).toHaveLength(0);
  });

  it('should log success message', () => {
    runTrack({ eventName: 'test_event' });

    expect(turbine.logger.log).toHaveBeenCalledWith(
      'Ours Privacy: Tracked event "test_event".'
    );
  });
});
