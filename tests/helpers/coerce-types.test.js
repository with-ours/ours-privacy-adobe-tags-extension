import { describe, it, expect } from 'vitest';
import coerceTypes from '../../src/lib/helpers/coerce-types.js';

describe('coerceTypes', () => {
  describe('null and undefined', () => {
    it('should return null as-is', () => {
      expect(coerceTypes(null)).toBe(null);
    });

    it('should return undefined as-is', () => {
      expect(coerceTypes(undefined)).toBe(undefined);
    });
  });

  describe('booleans', () => {
    it('should coerce "true" to true', () => {
      expect(coerceTypes('true')).toBe(true);
    });

    it('should coerce "false" to false', () => {
      expect(coerceTypes('false')).toBe(false);
    });

    it('should coerce case-insensitively', () => {
      expect(coerceTypes('TRUE')).toBe(true);
      expect(coerceTypes('False')).toBe(false);
    });

    it('should return boolean values as-is', () => {
      expect(coerceTypes(true)).toBe(true);
      expect(coerceTypes(false)).toBe(false);
    });
  });

  describe('numbers', () => {
    it('should coerce integer strings', () => {
      expect(coerceTypes('123')).toBe(123);
      expect(coerceTypes('0')).toBe(0);
    });

    it('should coerce negative number strings', () => {
      expect(coerceTypes('-42')).toBe(-42);
    });

    it('should coerce float strings', () => {
      expect(coerceTypes('3.14')).toBe(3.14);
    });

    it('should return number values as-is', () => {
      expect(coerceTypes(42)).toBe(42);
    });

    it('should not coerce strings with leading/trailing spaces', () => {
      expect(coerceTypes(' 123 ')).toBe(' 123 ');
    });
  });

  describe('null and undefined strings', () => {
    it('should coerce "null" to null', () => {
      expect(coerceTypes('null')).toBe(null);
    });

    it('should coerce "undefined" to undefined', () => {
      expect(coerceTypes('undefined')).toBe(undefined);
    });
  });

  describe('empty strings', () => {
    it('should coerce empty string to undefined', () => {
      expect(coerceTypes('')).toBe(undefined);
    });

    it('should coerce whitespace-only string to undefined', () => {
      expect(coerceTypes('   ')).toBe(undefined);
    });
  });

  describe('regular strings', () => {
    it('should keep non-matching strings as-is', () => {
      expect(coerceTypes('hello')).toBe('hello');
      expect(coerceTypes('abc123')).toBe('abc123');
    });
  });

  describe('objects', () => {
    it('should recursively coerce object values', () => {
      const result = coerceTypes({
        name: 'John',
        age: '30',
        active: 'true',
        score: '9.5',
      });

      expect(result).toEqual({
        name: 'John',
        age: 30,
        active: true,
        score: 9.5,
      });
    });

    it('should omit undefined values from objects', () => {
      const result = coerceTypes({
        a: 'hello',
        b: '',
        c: 'undefined',
      });

      expect(result).toEqual({ a: 'hello' });
      expect(result).not.toHaveProperty('b');
      expect(result).not.toHaveProperty('c');
    });

    it('should keep null values in objects', () => {
      const result = coerceTypes({ a: 'null' });
      expect(result).toEqual({ a: null });
    });
  });

  describe('arrays', () => {
    it('should recursively coerce array elements', () => {
      const result = coerceTypes(['123', 'true', 'hello']);
      expect(result).toEqual([123, true, 'hello']);
    });
  });
});
