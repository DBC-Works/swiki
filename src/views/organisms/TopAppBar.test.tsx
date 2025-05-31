import { screen } from '@testing-library/react'

import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { EditingInfo } from '../../states/edit/types'
import { setupComponentWithStateProviderUnderTest } from '../../testUtils'
vi.mock('../adapters/hooks.ts')

import { TopAppBar } from './TopAppBar'

describe('TopAppBar component', () => {
  const setup = async (initialEditingInfo: EditingInfo | null = null) =>
    setupComponentWithStateProviderUnderTest(<TopAppBar />, null, initialEditingInfo)

  it('should have the application title', () => {
    // arrange
    setup()

    // act
    const actual = screen.getByRole('heading', { name: 'swiki', level: 1 })

    // assert
    expect(actual).toBeInTheDocument()
  })

  it.each([['FrontPage'], ['Pages'], ['History']])(
    'should have the link to the %s page',
    (pageTitle: string) => {
      // arrange
      setup()

      // act
      const actual = screen.getByRole('button', { name: pageTitle })

      // assert
      expect(actual).toBeInTheDocument()
    },
  )

  it.each([['FrontPage'], ['Pages'], ['History']])(
    'should show discard confirmation dialog when %s button is pressed in editing',
    async (pageTitle: string) => {
      // arrange
      setup({ editing: true, processing: false })

      // act
      await userEvent.click(screen.getByRole('button', { name: pageTitle }))

      // assert
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    },
  )

  it.each([['FrontPage'], ['Pages'], ['History']])(
    'should hide discard confirmation dialog when try to move %s page in editing but Cancel button is pressed',
    async (pageTitle: string) => {
      // arrange
      setup({ editing: true, processing: false })

      // act
      await userEvent.click(screen.getByRole('button', { name: pageTitle }))
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

      // assert
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    },
  )
})
