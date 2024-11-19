import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'
import React from 'react'

import { type RenderResult, getByRole, render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import './i18n'
import { routeTree } from './routeTree.gen'

describe('route', () => {
  const setup = async (initialPath: string) => {
    const router = createRouter({
      routeTree,
      defaultNotFoundComponent: () => <h2>Not found</h2>,
      history: createMemoryHistory({
        initialEntries: [initialPath],
      }),
    })

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
    await setup('/')

    // act
    const heading = screen.getByRole('heading', { name: 'swiki', level: 1 })

    // assert
    expect(heading).toBeInTheDocument()
  })

  describe('FrontPage', () => {
    it('should move to FrontPage edit page when edit Fab pressed', async () => {
      // arrange
      await setup('/')

      // act
      await userEvent.click(screen.getByRole('button', { name: 'Edit' }))

      // assert
      expect(
        screen.getByRole('heading', { name: 'Source - FrontPage', level: 2 }),
      ).toBeInTheDocument()
    })
  })

  describe('Edit page', () => {
    it('should move to FrontPage when FrontPage button in app bar pressed', async () => {
      // arrange
      await setup('/pages/FrontPage/edit')

      // act
      await userEvent.click(screen.getByRole('button', { name: 'FrontPage' }))

      // assert
      expect(
        await screen.findByRole('heading', { name: 'FrontPage', level: 2 }),
      ).toBeInTheDocument()
    })

    it('should return to FrontPage if moved from FrontPage and click the cancel button without editing', async () => {
      // arrange
      await setup('/')
      await userEvent.click(screen.getByRole('button', { name: 'Edit' }))

      // act
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

      // assert
      expect(
        await screen.findByRole('heading', { name: 'FrontPage', level: 2 }),
      ).toBeInTheDocument()
    })

    it('should show confirmation dialog if click the cancel button with editing', async () => {
      // arrange
      await setup('/')
      await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
      await userEvent.type(screen.getByRole('textbox', { name: 'Title' }), 'updated title')

      // act
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

      // assert
      expect(
        await screen.findByText('Are you sure you want to discard your edits?'),
      ).toBeInTheDocument()
    })

    it('should discard editing content and move back to from page if the OK button in the confirmation dialog is clicked.', async () => {
      // arrange
      await setup('/')
      await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
      await userEvent.type(screen.getByRole('textbox', { name: 'Title' }), 'updated title')
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

      // act
      await userEvent.click(getByRole(screen.getByRole('dialog'), 'button', { name: 'OK' }))

      // assert
      expect(
        await screen.findByRole('heading', { name: 'FrontPage', level: 2 }),
      ).toBeInTheDocument()
      expect(
        screen.queryByText('Are you sure you want to discard your edits?'),
      ).not.toBeInTheDocument()
    })

    it('should dismiss confirmation dialog if the cancel button in the confirmation dialog is clicked.', async () => {
      // arrange
      await setup('/')
      await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
      await userEvent.type(screen.getByRole('textbox', { name: 'Title' }), 'updated title')
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

      // act
      await userEvent.click(getByRole(screen.getByRole('dialog'), 'button', { name: 'Cancel' }))

      // assert
      expect(
        await screen.findByRole('heading', { name: /^Source - FrontPage/, level: 2 }),
      ).toBeInTheDocument()
      expect(
        screen.queryByText('Are you sure you want to discard your edits?'),
      ).not.toBeInTheDocument()
    })
  })
})
