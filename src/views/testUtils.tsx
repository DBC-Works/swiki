import { vi } from 'vitest'

/**
 * Mock Link adapter component
 */
export const mockLinkAdapter = (): void => {
  vi.mock('./adapters/Link', () => {
    return {
      Link: ({ to, children }: { to: string; children: React.ReactNode }): JSX.Element => (
        <a href={to}>{children}</a>
      ),
    }
  })
}
