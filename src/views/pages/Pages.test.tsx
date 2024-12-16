import type { PageSet } from '../../states/pages/types'
import { Pages } from './Pages'

import { screen } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { setupComponentWithStateProviderUnderTest } from '../../testUtils'

describe('Pages component', () => {
  const setup = (initialPageSet: PageSet | null = null) =>
    setupComponentWithStateProviderUnderTest(<Pages />, initialPageSet)

  beforeAll(() => {
    vi.mock('../adapters/hooks.ts', () => {
      return {
        useReturnPath: () => {
          return () => '/'
        },
        useMoveTo: () => {
          return () => {}
        },
      }
    })
  })

  it('should list up "FrontPage" and "SandBox" as items without update information if no page data', () => {
    // arrange & act
    setup()

    // assert
    expect(screen.getAllByRole('button')).toHaveLength(2)
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
    expect(screen.getAllByRole('button')).toHaveLength(3)
    expect(
      screen.getByRole('button', {
        name: /^FrontPage\(Updated\).+1st update on Jan 1, 2024 12:34 PM$/,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: /^SandBox\(Updated\).+1st update on Jan 2, 2024 12:34 PM$/,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^Updated page.+2nd update on Jan 1, 2025 12:34 PM$/ }),
    ).toBeInTheDocument()
  })
})