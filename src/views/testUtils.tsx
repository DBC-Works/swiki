import React from 'react'

import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { vi } from 'vitest'

import '../i18n'

/**
 * Set up component under test
 * @param component Component under test
 * @returns Object for test
 */
export const setupComponentUnderTest = (component: React.ReactNode) => ({
  userEvent: userEvent.setup(),
  renderResult: render(<React.StrictMode>{component}</React.StrictMode>),
})

/**
 * Mock Link adapter component
 */
export const mockLinkAdapter = () => {
  vi.mock('./adapters/Link', () => {
    return {
      Link: ({ to, children }: { to: string; children: React.ReactNode }): JSX.Element => (
        <a href={to}>{children}</a>
      ),
    }
  })
}
