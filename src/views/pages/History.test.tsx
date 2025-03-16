import type { PageSet } from '../../states/pages/types'

import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { setupComponentWithStateProviderUnderTest } from '../../testUtils'
vi.mock('../adapters/hooks.ts')
vi.mock('../adapters/Link')

import { History } from './History'

describe('History component', () => {
  const getAllPageButtons = () =>
    screen
      .getAllByRole('button')
      .map((button) => button.textContent)
      .filter((text) => text !== '' && text !== 'Export')

  const setup = (initialPageSet: PageSet | null = null) =>
    setupComponentWithStateProviderUnderTest(<History />, initialPageSet, null)

  it('should list up "FrontPage" and "SandBox" as items without update information if no page data', () => {
    // arrange & act
    setup()

    // assert
    expect(getAllPageButtons()).toHaveLength(2)
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
    expect(getAllPageButtons()).toHaveLength(3)
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

  it('should list pages in descending order of update time', () => {
    // arrange & act
    setup({
      frontPage: null,
      sandBox: null,
      pages: [
        {
          id: crypto.randomUUID(),
          pageDataHistory: [
            {
              title: 'Older page',
              language: 'en',
              content: 'Older page content',
              dateAndTime: '2024-11-30T12:34:56',
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          pageDataHistory: [
            {
              title: 'Elder page(updated)',
              language: 'en',
              content: 'Elder page content',
              dateAndTime: '2025-01-01T12:34:56',
            },
            {
              title: 'Elder page',
              language: 'en',
              content: 'Elder page content',
              dateAndTime: '2024-01-01T12:34:56',
            },
          ],
        },
      ],
    })

    // assert
    const actual = getAllPageButtons()
    const expected = ['Elder page(updated)', 'Older page', 'SandBox', 'FrontPage']
    expect(actual).toHaveLength(expected.length)
    for (let index = 0; index < actual.length; ++index) {
      expect(actual[index]?.startsWith(expected[index])).toBeTruthy()
    }
  })

  describe('export', () => {
    it('should show the "Export" button and hide the "Download" button', () => {
      // arrange & act
      setup()

      // assert
      expect(screen.getByRole('button', { name: 'Export' })).not.toBeDisabled()
      expect(screen.getByRole('link', { name: 'Download' })).toHaveAttribute('href', '#')
    })

    it('should show the "Download" button and hide the "Export" button if the "Export" button pressed', async () => {
      // arrange
      setup()

      // act
      await userEvent.click(screen.getByRole('button', { name: 'Export' }))

      // assert
      expect(screen.getByRole('link', { name: 'Download' })).toHaveAttribute(
        'href',
        expect.stringMatching(/^blob:/),
      )
      expect(screen.getByRole('button', { name: 'Export' })).toBeDisabled()
    })
  })
})
