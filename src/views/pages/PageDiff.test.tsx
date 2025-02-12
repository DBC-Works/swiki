import type { PageSet } from '../../states/pages/types'

import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { setupComponentWithStateProviderUnderTest } from '../../testUtils'
vi.mock('../adapters/hooks.ts')
vi.mock('../adapters/Link')

import { PageDiff } from './PageDiff'

describe('PageDiff component', () => {
  const TEST_PAGE_SET: PageSet = {
    frontPage: null,
    sandBox: null,
    pages: [
      {
        id: crypto.randomUUID(),
        pageDataHistory: [
          {
            language: 'en',
            title: 'Rev.2',
            content: 'Content.\nAdd line.',
            dateAndTime: '2025-02-01T00:00:00Z',
          },
          {
            language: 'en',
            title: 'Rev.1',
            content: 'Content.\nDelete line.',
            dateAndTime: '2025-01-01T00:00:00Z',
          },
        ],
      },
    ],
  }

  const setup = (pageTitle: string, from: string, to: string, initialPageSet: PageSet) =>
    setupComponentWithStateProviderUnderTest(
      <PageDiff pageTitle={pageTitle} from={from} to={to} />,
      initialPageSet,
      null,
    )

  it('should display title as heading', () => {
    // arrange & act
    setup('Rev.2', '1', '2', TEST_PAGE_SET)

    // assert
    expect(
      screen.getByRole('heading', { name: 'Diff between Rev.1 and Rev.2 of “Rev.2”', level: 2 }),
    ).toBeInTheDocument()
  })

  it('should have two tabs, "Difference" and "Information"', () => {
    // arrange & act
    setup('Rev.2', '1', '2', TEST_PAGE_SET)

    // assert
    expect(screen.getByRole('tab', { name: 'Difference' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Information' })).toBeInTheDocument()
  })

  describe('Difference tab', () => {
    it('should display the link to the latest content browse page', () => {
      // arrange & act
      setup('Rev.2', '1', '2', TEST_PAGE_SET)

      // assert
      expect(screen.getByRole('link', { name: 'Back to “Rev.2”' })).toBeInTheDocument()
    })

    it('should display the difference sequence', async () => {
      // arrange
      setup('Rev.2', '1', '2', TEST_PAGE_SET)

      // act
      await userEvent.click(screen.getByRole('tab', { name: 'Information' }))
      await userEvent.click(screen.getByRole('tab', { name: 'Difference' }))

      // assert
      expect(screen.getByText('Added')).toBeInTheDocument()
      expect(screen.getByText('Keep')).toBeInTheDocument()
      expect(screen.getByText('Deleted')).toBeInTheDocument()
    })
  })

  describe('Information tab', () => {
    it('should display "Target" and "Source" headings', async () => {
      // arrange
      setup('Rev.2', '1', '2', TEST_PAGE_SET)

      // act
      await userEvent.click(screen.getByRole('tab', { name: 'Information' }))

      // assert
      expect(screen.getByRole('heading', { name: 'Target', level: 3 })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Source', level: 3 })).toBeInTheDocument()
    })
  })
})
