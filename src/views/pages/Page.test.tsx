import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { PageData, PageSet } from '../../states/pages/types'
import { fireToggleEvent, setupComponentWithStateProviderUnderTest } from '../../testUtils'
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
      fireToggleEvent(screen.getByText(/update at/).closest('details') as HTMLDetailsElement)

      // assert
      expect(screen.getAllByText('Content page')).toHaveLength(2)
      expect(screen.getAllByText(/Rev\..+/)).toHaveLength(2)
      expect(screen.getByText('Content page(initial)')).toBeInTheDocument()
    })

    it('should close page opened history list if summary is pressed', () => {
      // arrange
      setup(initialPageSet)
      const detailsElement = screen.getByText(/update at/).closest('details') as HTMLDetailsElement
      fireToggleEvent(detailsElement)
      expect(screen.getAllByText('Content page')).toHaveLength(2)

      // act
      fireToggleEvent(detailsElement)

      // assert
      expect(screen.getAllByText('Content page')).toHaveLength(1)
      expect(screen.queryByText(/Rev\..+/)).not.toBeInTheDocument()
      expect(screen.queryByText('Content page(initial)')).not.toBeInTheDocument()
    })

    it('should not show the comparison page selector if page history is only one', () => {
      // arrange
      setup({
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
            ] as NonEmptyArray<PageData>,
          },
        ],
      })

      // act
      fireToggleEvent(screen.getByText(/update at/).closest('details') as HTMLDetailsElement)

      // assert
      expect(screen.queryByRole('listbox', { name: 'Compare with...' })).not.toBeInTheDocument()
    })

    it('should show the comparison page selector if page history is more than one', async () => {
      // arrange
      setup({
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
                dateAndTime: '2025-01-02T00:00:00Z',
              },
              {
                language: 'en',
                title: 'Content page(2nd)',
                content: 'Content page content',
                dateAndTime: '2025-01-01T00:00:00Z',
              },
              {
                language: 'en',
                title: 'Content page(1st)',
                content: 'Content page content',
                dateAndTime: '2024-12-31T12:34:56Z',
              },
            ] as NonEmptyArray<PageData>,
          },
        ],
      })

      // act
      fireToggleEvent(screen.getByText(/update at/).closest('details') as HTMLDetailsElement)

      // assert
      const actual = screen.getAllByRole('combobox', { name: 'Compare with...' })
      expect(actual).toHaveLength(3)

      let cbIndex = actual.length - 1
      for (const combobox of actual) {
        await userEvent.click(combobox)

        const options = screen.getAllByRole('option')
        expect(options).toHaveLength(2)

        const expected = Array.from({ length: actual.length }, (_, i) => i)
          .reverse()
          .filter((i) => i !== cbIndex)
          .map((i) => `Rev.${i + 1}`)
        expect(options.map((option) => option.textContent)).toEqual(expected)

        --cbIndex
      }
    })
  })
})
