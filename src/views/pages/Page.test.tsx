import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { PageData, PageSet } from '../../states/pages/types'
import { setupComponentWithStateProviderUnderTest } from '../../testUtils'
import type { NonEmptyArray } from '../../types'
vi.mock('../adapters/hooks.ts')
vi.mock('../adapters/Link')

import { Page } from './Page'

describe('Page component', () => {
  const initialPageSet = {
    frontPage: null,
    sandBox: null,
    pages: [
      {
        id: crypto.randomUUID(),
        pageDataHistory: [
          {
            language: 'en',
            title: 'Content page',
            content: 'Content page content',
            dateAndTime: '2025-01-01T00:00:00Z',
          },
          {
            language: 'en',
            title: 'Content page(initial)',
            content: 'Initial content page content',
            dateAndTime: '2024-12-31T00:00:00Z',
          },
        ] as NonEmptyArray<PageData>,
      },
    ],
  }

  const setup = (initialPageSet: PageSet | null = null) =>
    setupComponentWithStateProviderUnderTest(<Page />, initialPageSet, null)

  it('should display title as heading', () => {
    // arrange & act
    setup(initialPageSet)

    // assert
    expect(screen.getByRole('heading', { name: 'Content page', level: 2 })).toBeInTheDocument()
  })

  describe('Page history', () => {
    it('should display last update time', () => {
      // arrange & act
      setup(initialPageSet)

      // assert
      expect(screen.getByText(/update at/)).toBeInTheDocument()
      expect(screen.queryByText(/^Rev\..+/)).not.toBeInTheDocument()
    })

    it('should open page history list if summary is pressed', () => {
      // arrange
      setup(initialPageSet)

      // act
      const detailsElement = screen.getByText(/update at/).closest('details')
      fireEvent(
        detailsElement as Element,
        new Event('toggle', {
          bubbles: true,
          cancelable: true,
        }),
      )

      // assert
      expect(screen.getAllByText('Content page')).toHaveLength(2)
      expect(screen.getAllByText(/Rev\..+/)).toHaveLength(2)
      expect(screen.getByText('Content page(initial)')).toBeInTheDocument()
    })

    it('should close page opened history list if summary is pressed', () => {
      // arrange
      setup(initialPageSet)
      const detailsElement = screen.getByText(/update at/).closest('details')
      const event = new Event('toggle', {
        bubbles: true,
        cancelable: true,
      })
      fireEvent(detailsElement as Element, event)
      expect(screen.getAllByText('Content page')).toHaveLength(2)

      // act
      fireEvent(detailsElement as Element, event)

      // assert
      expect(screen.getAllByText('Content page')).toHaveLength(1)
      expect(screen.queryByText(/Rev\..+/)).not.toBeInTheDocument()
      expect(screen.queryByText('Content page(initial)')).not.toBeInTheDocument()
    })
  })
})
