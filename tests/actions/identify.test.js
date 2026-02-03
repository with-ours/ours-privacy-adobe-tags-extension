import { describe, it, expect, beforeEach, vi } from 'vitest';
import ensureOursFunction from '../../src/lib/helpers/ensure-ours-function.js';
import buildObjectFromTable from '../../src/lib/helpers/build-object-from-table.js';
import coerceTypes from '../../src/lib/helpers/coerce-types.js';

describe('identify action', () => {
  var mockWindow;
  var oursCalls;

  beforeEach(() => {
    mockWindow = {};
    oursCalls = [];

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

  function runIdentify(settings) {
    var ours = ensureOursFunction(mockWindow);

    var userProperties = coerceTypes(
      buildObjectFromTable(settings.userProperties)
    );

    if (!userProperties || Object.keys(userProperties).length === 0) {
      turbine.logger.error(
        'Ours Privacy Identify: At least one user property is required.'
      );
      return;
    }

    ours('identify', userProperties);

    turbine.logger.log('Ours Privacy: Identified user.');
  }

  it('should call ours identify with user properties', () => {
    runIdentify({
      userProperties: [
        { key: 'email', value: 'test@example.com' },
        { key: 'name', value: 'John Doe' },
      ],
    });

    expect(oursCalls).toHaveLength(1);
    expect(oursCalls[0][0]).toBe('identify');
    expect(oursCalls[0][1]).toEqual({
      email: 'test@example.com',
      name: 'John Doe',
    });
  });

  it('should coerce property values to proper types', () => {
    runIdentify({
      userProperties: [
        { key: 'premium', value: 'true' },
        { key: 'age', value: '28' },
        { key: 'name', value: 'Jane' },
      ],
    });

    expect(oursCalls[0][1]).toEqual({
      premium: true,
      age: 28,
      name: 'Jane',
    });
  });

  it('should log an error when no user properties are provided', () => {
    runIdentify({});

    expect(turbine.logger.error).toHaveBeenCalledWith(
      'Ours Privacy Identify: At least one user property is required.'
    );
    expect(oursCalls).toHaveLength(0);
  });

  it('should log an error when user properties array is empty', () => {
    runIdentify({ userProperties: [] });

    expect(turbine.logger.error).toHaveBeenCalled();
    expect(oursCalls).toHaveLength(0);
  });

  it('should log an error when all properties have empty keys', () => {
    runIdentify({
      userProperties: [
        { key: '', value: 'val' },
        { key: '', value: 'val2' },
      ],
    });

    expect(turbine.logger.error).toHaveBeenCalled();
    expect(oursCalls).toHaveLength(0);
  });

  it('should log success message', () => {
    runIdentify({
      userProperties: [{ key: 'email', value: 'test@test.com' }],
    });

    expect(turbine.logger.log).toHaveBeenCalledWith(
      'Ours Privacy: Identified user.'
    );
  });
});
