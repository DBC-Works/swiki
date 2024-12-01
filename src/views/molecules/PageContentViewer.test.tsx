import { screen } from '@testing-library/react'

import { describe, expect, it } from 'vitest'
import { setupComponentUnderTest } from '../../testUtils'

import { PageContentViewer } from './PageContentViewer'

describe('PageContentViewer component', () => {
  const setup = (content: string) =>
    setupComponentUnderTest(<PageContentViewer lang="en">{content}</PageContentViewer>)

  it('should contain the article element with a lang attribute', () => {
    // arrange & act
    setup('')

    // assert
    expect(screen.getByRole('article')).toHaveAttribute('lang')
  })

  it('should translate markdown text to HTML', () => {
    // arrange & act
    setup(`
## Page title
      `)

    // assert
    expect(screen.getByRole('heading', { level: 2, name: 'Page title' })).toBeInTheDocument()
  })
})
