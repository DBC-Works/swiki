import type { PageSet } from '../../states/pages/types'

import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { setupComponentWithStateProviderUnderTest } from '../../testUtils'
vi.mock('../adapters/hooks.ts')
vi.mock('../adapters/Link')

import { Pages } from './Pages'

describe('Pages component', () => {
  const setup = (initialPageSet: PageSet | null = null) =>
    setupComponentWithStateProviderUnderTest(<Pages />, initialPageSet, null)

  it('should list up "FrontPage" and "SandBox" as items without update information if no page data', () => {
    // arrange & act
    setup()

    // assert
    expect(screen.getAllByRole('button')).toHaveLength(3)
    expect(screen.getByRole('button', { name: /^FrontPage.+-$/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^SandBox.+-$/ })).toBeInTheDocument()
  })

  it('should list up pages as items', () => {
    // arrange & act
    setup({
      frontPage: {
        id: crypto.randomUUID(),
        pageDataHistory: [
          {
            title: 'FrontPage(Updated)',
            language: 'en',
            content: 'FrontPage content',
            dateAndTime: '2024-01-01T12:34:56',
          },
        ],
      },
      sandBox: {
        id: crypto.randomUUID(),
        pageDataHistory: [
          {
            title: 'SandBox(Updated)',
            language: 'en',
            content: 'SandBox content',
            dateAndTime: '2024-01-02T12:34:56',
          },
        ],
      },
      pages: [
        {
          id: crypto.randomUUID(),
          pageDataHistory: [
            {
              title: 'Updated page',
              language: 'en',
              content: 'Updated page content',
              dateAndTime: '2025-01-01T12:34:56',
            },
            {
              title: 'Initial page',
              language: 'en',
              content: 'Initial page content',
              dateAndTime: '2024-12-31T12:34:56',
            },
          ],
        },
      ],
    })

    // assert
    expect(screen.getAllByRole('button')).toHaveLength(4)
    expect(
      screen.getByRole('button', {
        name: /^FrontPage\(Updated\).+1st update at Jan 1, 2024 12:34 PM$/,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: /^SandBox\(Updated\).+1st update at Jan 2, 2024 12:34 PM$/,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^Updated page.+2nd update at Jan 1, 2025 12:34 PM$/ }),
    ).toBeInTheDocument()
  })

  describe('Sort', () => {
    it('should be able to choose the sort order', () => {
      // arrange & act
      setup()

      // assert
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it.for([
      {
        option: 'Create time(ascending)',
        expected: [
          'Front page(Updated)1st update at Jan 2, 2025 12:34 PM',
          'SandBox-',
          'Added page(2)1st update at Feb 1, 2025 12:34 PM',
          'Added page(1)2nd update at Mar 1, 2025 12:34 PM',
        ],
      },
      {
        option: 'Create time(descending)',
        expected: [
          'Added page(1)2nd update at Mar 1, 2025 12:34 PM',
          'Added page(2)1st update at Feb 1, 2025 12:34 PM',
          'SandBox-',
          'Front page(Updated)1st update at Jan 2, 2025 12:34 PM',
        ],
      },
      {
        option: 'Update time(descending)',
        expected: [
          'Added page(1)2nd update at Mar 1, 2025 12:34 PM',
          'Added page(2)1st update at Feb 1, 2025 12:34 PM',
          'Front page(Updated)1st update at Jan 2, 2025 12:34 PM',
          'SandBox-',
        ],
      },
    ])(
      'should reorder the page list if the sort order "$option" is selected',
      async ({ option, expected }) => {
        // arrange
        setup({
          frontPage: {
            id: crypto.randomUUID(),
            pageDataHistory: [
              {
                title: 'Front page(Updated)',
                language: 'en',
                content: 'Front page content',
                dateAndTime: '2025-01-02T12:34:56',
              },
            ],
          },
          sandBox: null,
          pages: [
            {
              id: crypto.randomUUID(),
              pageDataHistory: [
                {
                  title: 'Added page(1)',
                  language: 'en',
                  content: 'Added content',
                  dateAndTime: '2025-03-01T12:34:56',
                },
                {
                  title: 'Added page(1)',
                  language: 'en',
                  content: 'Added content',
                  dateAndTime: '2025-01-01T12:34:56',
                },
              ],
            },
            {
              id: crypto.randomUUID(),
              pageDataHistory: [
                {
                  title: 'Added page(2)',
                  language: 'en',
                  content: 'Added content',
                  dateAndTime: '2025-02-01T12:34:56',
                },
              ],
            },
          ],
        })

        // act
        await userEvent.click(screen.getByRole('combobox'))
        await userEvent.click(screen.getByRole('option', { name: option }))

        // assert
        const actual = screen
          .getAllByRole('button')
          .filter((button) => button.textContent)
          .map((button) => button.textContent)
        expect(actual).toEqual(expected)
      },
    )
  })
})
