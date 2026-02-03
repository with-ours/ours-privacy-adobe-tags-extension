import { describe, it, expect } from 'vitest';
import ensureOursFunction from '../../src/lib/helpers/ensure-ours-function.js';

describe('ensureOursFunction', () => {
  it('should create a stub function when ours does not exist', () => {
    var win = {};
    var ours = ensureOursFunction(win);

    expect(typeof ours).toBe('function');
    expect(ours.queue).toBeDefined();
    expect(Array.isArray(ours.queue)).toBe(true);
    expect(ours.version).toBe('1.0');
    expect(win.ours).toBe(ours);
  });

  it('should queue calls made to the stub', () => {
    var win = {};
    var ours = ensureOursFunction(win);

    ours('track', 'page_view', { page: '/home' });
    ours('identify', { email: 'test@test.com' });

    expect(ours.queue).toHaveLength(2);
    expect(ours.queue[0]).toEqual(['track', 'page_view', { page: '/home' }]);
    expect(ours.queue[1]).toEqual(['identify', { email: 'test@test.com' }]);
  });

  it('should return existing ours function if already defined', () => {
    var existingFn = function () {};
    existingFn.queue = [];
    var win = { ours: existingFn };

    var result = ensureOursFunction(win);

    expect(result).toBe(existingFn);
  });

  it('should return the same stub on subsequent calls', () => {
    var win = {};
    var first = ensureOursFunction(win);
    var second = ensureOursFunction(win);

    expect(first).toBe(second);
  });

  it('should add queue to existing non-function ours', () => {
    var win = { ours: {} };
    var ours = ensureOursFunction(win);

    expect(ours.queue).toEqual([]);
    expect(ours.version).toBe('1.0');
  });
});
