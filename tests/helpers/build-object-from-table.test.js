import { describe, it, expect } from 'vitest';
import buildObjectFromTable from '../../src/lib/helpers/build-object-from-table.js';

describe('buildObjectFromTable', () => {
  it('should convert key-value pairs to an object', () => {
    const result = buildObjectFromTable([
      { key: 'name', value: 'John' },
      { key: 'age', value: '30' },
    ]);

    expect(result).toEqual({ name: 'John', age: '30' });
  });

  it('should return empty object for null input', () => {
    expect(buildObjectFromTable(null)).toEqual({});
  });

  it('should return empty object for undefined input', () => {
    expect(buildObjectFromTable(undefined)).toEqual({});
  });

  it('should return empty object for empty array', () => {
    expect(buildObjectFromTable([])).toEqual({});
  });

  it('should return empty object for non-array input', () => {
    expect(buildObjectFromTable('not an array')).toEqual({});
    expect(buildObjectFromTable(123)).toEqual({});
    expect(buildObjectFromTable({})).toEqual({});
  });

  it('should skip entries with missing keys', () => {
    const result = buildObjectFromTable([
      { key: '', value: 'val1' },
      { key: null, value: 'val2' },
      { key: undefined, value: 'val3' },
      { key: 'valid', value: 'val4' },
    ]);

    expect(result).toEqual({ valid: 'val4' });
  });

  it('should skip entries with undefined values', () => {
    const result = buildObjectFromTable([
      { key: 'a', value: undefined },
      { key: 'b', value: 'hello' },
    ]);

    expect(result).toEqual({ b: 'hello' });
  });

  it('should skip entries with empty string values', () => {
    const result = buildObjectFromTable([
      { key: 'a', value: '' },
      { key: 'b', value: 'hello' },
    ]);

    expect(result).toEqual({ b: 'hello' });
  });

  it('should include null values', () => {
    const result = buildObjectFromTable([{ key: 'a', value: null }]);

    // null is not undefined and not '', so it should be skipped
    // Actually per the code: value !== undefined && value !== ''
    // null !== undefined is true, null !== '' is true, so null IS included
    expect(result).toEqual({ a: null });
  });

  it('should skip non-object entries', () => {
    const result = buildObjectFromTable([null, undefined, 'string', { key: 'valid', value: 'v' }]);

    expect(result).toEqual({ valid: 'v' });
  });

  it('should handle duplicate keys by using last value', () => {
    const result = buildObjectFromTable([
      { key: 'a', value: 'first' },
      { key: 'a', value: 'second' },
    ]);

    expect(result).toEqual({ a: 'second' });
  });
});
