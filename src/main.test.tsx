import { RouterProvider, createRouter } from '@tanstack/react-router'
import React from 'react'

import { type RenderResult, render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import './i18n'
import { routeTree } from './routeTree.gen'

describe('route', () => {
  const router = createRouter({
    routeTree,
    defaultNotFoundComponent: () => <h2>Not found</h2>,
  })

  const setup = async () => {
    userEvent.setup()
    let rendered: RenderResult | null = null
    await waitFor(() => {
      rendered = render(
        <React.StrictMode>
          <RouterProvider router={router} />
        </React.StrictMode>,
      )
    })
    return rendered
  }

  it('should have the heading application title', async () => {
    // arrange
    await setup()

    // act
    const heading = screen.getByRole('heading', { name: 'swiki', level: 1 })

    // assert
    expect(heading).toBeInTheDocument()
  })
})
