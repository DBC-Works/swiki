import { DataFormatVersions, type PageSet, PageTypes } from '../../states/pages/types'

import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { setupComponentWithStateProviderUnderTest } from '../../testUtils'
import * as Functions from '../functions/utilities'
import * as Hooks from '../hooks/hooks'
vi.mock('../adapters/hooks.ts')
vi.mock('../adapters/Link')

import { History } from './History'

describe('History component', () => {
  const getAllPageButtons = () =>
    screen
      .getAllByRole('button')
      .map((button) => button.textContent)
      .filter((text) => ['', 'Export', 'Import'].includes(text as string) === false)

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

  describe('import', () => {
    it('should show the "Import" button', () => {
      // arrange & act
      setup()

      // assert
      expect(screen.getByRole('button', { name: 'Import' })).toBeInTheDocument()
    })

    it('should report validation error if the selected file is invalid', async () => {
      // arrange
      vi.spyOn(Hooks, 'useClickInput').mockImplementation(() => {
        const inputFileElement = screen.getByTestId('upload-file')
        fireEvent.change(inputFileElement)
      })
      vi.spyOn(Functions, 'getUploadText').mockImplementation(async () => {
        return 'invalid import data'
      })
      setup()

      // act
      await userEvent.click(screen.getByRole('button', { name: 'Import' }))

      // assert
      expect(await screen.findByRole('dialog')).toHaveTextContent(
        'The format of the specified file is not supported.',
      )
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })

    it('should merge imported data with existing data if the selected file is valid', async () => {
      // arrange
      const importPage = {
        id: crypto.randomUUID(),
        pageDataHistory: [
          {
            language: 'en',
            title: 'Import page',
            content: 'Content of import page',
            dateAndTime: '2025-05-01T00:00:00Z',
          },
        ],
      }
      const versionedPageList = {
        version: DataFormatVersions.v202503,
        pages: [
          {
            type: PageTypes.Content,
            page: importPage,
          },
        ],
      }
      vi.spyOn(Hooks, 'useClickInput').mockImplementation(() => {
        const inputFileElement = screen.getByTestId('upload-file')
        fireEvent.change(inputFileElement)
      })
      vi.spyOn(Functions, 'getUploadText').mockImplementation(async () => {
        return JSON.stringify(versionedPageList)
      })
      setup()

      // act
      await userEvent.click(screen.getByRole('button', { name: 'Import' }))

      // assert
      expect(
        await screen.findByRole('button', {
          name: /^Import page.+1st update at May 1, 2025 [0-9]?[0-9]:[0-9][0-9] [AP]M$/,
        }),
      ).toBeInTheDocument()
    })
  })
})
