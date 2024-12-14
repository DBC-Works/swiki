import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { setupComponentUnderTest } from '../../testUtils'
vi.mock('../adapters/Link')

import { TopAppBar } from './TopAppBar'

describe('TopAppBar component', () => {
  const setup = () => setupComponentUnderTest(<TopAppBar />)

  it('should have the application title', () => {
    // arrange
    setup()

    // act
    const actual = screen.getByRole('heading', { name: 'swiki', level: 1 })

    // assert
    expect(actual).toBeInTheDocument()
  })

  it.each([
    ['front', 'FrontPage', '/'],
    ['pages', 'Pages', '/pages'],
    ['history', 'History', '/history'],
  ])('should have the link to the %s page', (_: string, pageTitle: string, href: string) => {
    // arrange
    setup()

    // act
    const actual = screen.getByRole('link', { name: pageTitle })

    // assert
    expect(actual).toBeInTheDocument()
    expect(actual).toHaveAttribute('href', href)
  })
})
