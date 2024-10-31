import React from 'react'

import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockLinkAdapter } from '../testUtils'

import { TopAppBar } from './TopAppBar'

describe('TopAppBar component', () => {
  const setup = async () => {
    userEvent.setup()
    return render(
      <React.StrictMode>
        <TopAppBar />
      </React.StrictMode>,
    )
  }

  beforeEach(() => {
    mockLinkAdapter()
  })
  afterEach(() => {
    vi.resetAllMocks()
    vi.restoreAllMocks()
  })

  it('should have the application title', async () => {
    // arrange
    await setup()

    // act
    const actual = screen.getByRole('heading', { name: 'swiki', level: 1 })

    // assert
    expect(actual).toBeInTheDocument()
  })

  it.each([
    ['front', 'FrontPage', '/'],
    ['pages', 'Pages', '/pages'],
    ['history', 'History', '/history'],
  ])('should have the link to the %s page', async (_: string, pageTitle: string, href: string) => {
    // arrange
    await setup()

    // act
    const actual = screen.getByRole('link', { name: pageTitle })

    // assert
    expect(actual).toBeInTheDocument()
    expect(actual).toHaveAttribute('href', href)
  })
})
