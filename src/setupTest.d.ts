import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'
import type { expect } from 'vitest'

declare module 'expect' {
  interface Matchers<R extends void | Promise<void>, _T = unknown>
    extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
}
