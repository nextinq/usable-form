// @flow

import { appendUniq } from '../append-uniq';

describe('appendUniq', () => {
  describe('append uniq number', () => {
    const arr = [1, 2, 3];
    it('should add uniq value', () => {
      expect(appendUniq(4, arr)).toEqual([1, 2, 3, 4]);
    });
    it('should skip non uniq value', () => {
      expect(appendUniq(3, arr)).toEqual([1, 2, 3]);
    });
  });

  describe('append uniq string', () => {
    const arr = ['a', 'b', 'c'];
    it('should add uniq value', () => {
      expect(appendUniq('d', arr)).toEqual(['a', 'b', 'c', 'd']);
    });
    it('should skip non uniq value', () => {
      expect(appendUniq('c', arr)).toEqual(['a', 'b', 'c']);
    });
  });
});
