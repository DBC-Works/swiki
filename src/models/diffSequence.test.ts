import { describe, expect, it } from 'vitest'
import { generateDiffSequence } from './diffSequence'

describe('diffSequence', () => {
  describe('generateDiffSequence function', () => {
    it.for([
      { lhs: [''], rhs: [''], expected: [{ type: 'Keep', sequence: [''] }] },
      {
        lhs: [''],
        rhs: ['Update line.'],
        expected: [
          { type: 'Added', sequence: ['Update line.'] },
          { type: 'Deleted', sequence: [''] },
        ],
      },
      {
        lhs: ['Original line.'],
        rhs: [''],
        expected: [
          { type: 'Added', sequence: [''] },
          { type: 'Deleted', sequence: ['Original line.'] },
        ],
      },
      {
        lhs: ['Original 1st line.', 'Original 2nd line.'],
        rhs: ['Updated 1st line.', 'Original 2nd line.'],
        expected: [
          { type: 'Added', sequence: ['Updated 1st line.'] },
          { type: 'Deleted', sequence: ['Original 1st line.'] },
          { type: 'Keep', sequence: ['Original 2nd line.'] },
        ],
      },
      {
        lhs: ['Original 1st line.', 'Original 2nd line.', 'Original 3rd line.'],
        rhs: ['Original 1st line.', 'Update 2nd line.', 'Original 3rd line.'],
        expected: [
          { type: 'Keep', sequence: ['Original 1st line.'] },
          { type: 'Added', sequence: ['Update 2nd line.'] },
          { type: 'Deleted', sequence: ['Original 2nd line.'] },
          { type: 'Keep', sequence: ['Original 3rd line.'] },
        ],
      },
      {
        lhs: ['Original 1st line.', 'Original 2nd line.', 'Original 3rd line.'],
        rhs: ['Original 1st line.', 'Original 2nd line.', 'Update 3rd line.'],
        expected: [
          { type: 'Keep', sequence: ['Original 1st line.', 'Original 2nd line.'] },
          { type: 'Added', sequence: ['Update 3rd line.'] },
          { type: 'Deleted', sequence: ['Original 3rd line.'] },
        ],
      },
    ])('should generate difference sequence', ({ lhs, rhs, expected }) => {
      // arrange & act
      const actual = generateDiffSequence(lhs, rhs)

      // assert
      expect(actual).toEqual(expected)
    })
  })
})
