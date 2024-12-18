import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'

import { getByRole, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import './i18n'
import { routeTree } from './routeTree.gen'
import type { PageData, PageSet } from './states/pages/types'
import { type SetUpResult, setupComponentWithStateProviderUnderTest } from './testUtils'
import type { NonEmptyArray } from './types'

describe('route', () => {
  const setup = async (initialPath: string, initialPageSet: PageSet | null = null) => {
    const router = createRouter({
      routeTree,
      defaultNotFoundComponent: () => <h2>Not found</h2>,
      history: createMemoryHistory({
        initialEntries: [initialPath],
      }),
    })

    let rendered: SetUpResult | null = null
    await waitFor(() => {
      rendered = setupComponentWithStateProviderUnderTest(
        <RouterProvider router={router} />,
        initialPageSet,
        null,
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

    it('should move to page list page when Pages button in app bar is pressed', async () => {
      // arrange
      await setup('/')

      // act
      await userEvent.click(screen.getByRole('button', { name: 'Pages' }))

      // assert
      expect(screen.getByRole('heading', { name: 'Pages', level: 2 })).toBeInTheDocument()
    })
  })

  describe('SandBox', () => {
    it('should move to FrontPage page when Pages button in app bar is pressed', async () => {
      // arrange
      await setup('/SandBox')

      // act
      await userEvent.click(screen.getByRole('button', { name: 'FrontPage' }))

      // assert
      expect(
        await screen.findByRole('heading', { name: 'FrontPage', level: 2 }),
      ).toBeInTheDocument()
    })

    it('should move to page list page when Pages button in app bar is pressed', async () => {
      // arrange
      await setup('/SandBox')

      // act
      await userEvent.click(screen.getByRole('button', { name: 'Pages' }))

      // assert
      expect(screen.getByRole('heading', { name: 'Pages', level: 2 })).toBeInTheDocument()
    })

    it('should move to SandBox edit page when edit Fab is pressed', async () => {
      // arrange
      await setup('/SandBox')

      // act
      await userEvent.click(screen.getByRole('button', { name: 'Edit' }))

      // assert
      expect(
        screen.getByRole('heading', { name: 'Source - SandBox', level: 2 }),
      ).toBeInTheDocument()
    })
  })

  describe('Pages', () => {
    it('should move to FrontPage page when Pages button in app bar is pressed', async () => {
      // arrange
      await setup('/pages')

      // act
      await userEvent.click(screen.getByRole('button', { name: 'FrontPage' }))

      // assert
      expect(screen.getByRole('heading', { name: 'FrontPage', level: 2 })).toBeInTheDocument()
    })

    it('should move to FrontPage when FrontPage button in page list is pressed', async () => {
      // arrange
      await setup('/pages')

      // act
      await userEvent.click(screen.getByRole('button', { name: /^FrontPage.+$/ }))

      // assert
      expect(screen.getByRole('heading', { name: 'FrontPage', level: 2 })).toBeInTheDocument()
    })

    it('should move to SandBox when SandBox button in page list is pressed', async () => {
      // arrange
      await setup('/pages')

      // act
      await userEvent.click(screen.getByRole('button', { name: /^SandBox.+$/ }))

      // assert
      expect(screen.getByRole('heading', { name: 'SandBox', level: 2 })).toBeInTheDocument()
    })

    it('should move to content page when content button in page list is pressed', async () => {
      // arrange
      const initialPageSet = {
        frontPage: null,
        sandBox: null,
        pages: [
          {
            id: crypto.randomUUID(),
            pageDataHistory: [
              {
                language: 'en',
                title: 'Content page',
                content: 'Content page content',
                dateAndTime: '2025-01-01T00:00:00Z',
              },
            ] as NonEmptyArray<PageData>,
          },
        ],
      }
      await setup('/pages', initialPageSet)

      // act
      await userEvent.click(screen.getByRole('button', { name: /^Content page.+$/ }))

      // assert
      expect(screen.getByRole('heading', { name: 'Content page', level: 2 })).toBeInTheDocument()
    })

    it('should move to add new page when add Fab is pressed', async () => {
      // arrange
      await setup('/pages')

      // act
      await userEvent.click(screen.getByLabelText('Add new page'))

      // assert
      expect(screen.getByRole('heading', { name: 'New page', level: 2 })).toBeInTheDocument()
    })
  })

  describe('Content page', () => {
    const initialPageSet = {
      frontPage: null,
      sandBox: null,
      pages: [
        {
          id: crypto.randomUUID(),
          pageDataHistory: [
            {
              language: 'en',
              title: 'Content page',
              content: 'Content page content',
              dateAndTime: '2025-01-01T00:00:00Z',
            },
          ] as NonEmptyArray<PageData>,
        },
      ],
    }

    it('should move to FrontPage page when Pages button in app bar is pressed', async () => {
      // arrange
      await setup('/pages/Content%20page', initialPageSet)

      // act
      await userEvent.click(screen.getByRole('button', { name: 'FrontPage' }))

      // assert
      expect(screen.getByRole('heading', { name: 'FrontPage', level: 2 })).toBeInTheDocument()
    })

    it('should move to page list page if there is no page with the specified title', async () => {
      // arrange & act
      await setup('/pages/NotExist', initialPageSet)

      // assert
      expect(await screen.findByRole('heading', { name: 'Pages', level: 2 })).toBeInTheDocument()
    })
  })

  describe('Add new page', () => {
    it('should move to FrontPage when FrontPage button in app bar is pressed without editing', async () => {
      // arrange
      await setup('/NewPage')

      // act
      await userEvent.click(screen.getByRole('button', { name: 'FrontPage' }))

      // assert
      expect(
        await screen.findByRole('heading', { name: 'FrontPage', level: 2 }),
      ).toBeInTheDocument()
    })

    it('should move to page list page when Pages button in app bar is pressed without editing', async () => {
      // arrange
      await setup('/NewPage')

      // act
      await userEvent.click(screen.getByRole('button', { name: 'Pages' }))

      // assert
      expect(await screen.findByRole('heading', { name: 'Pages', level: 2 })).toBeInTheDocument()
    })

    it('should return to page list page when the cancel button is pressed without editing', async () => {
      // arrange
      await setup('/NewPage')

      // act
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

      // assert
      expect(await screen.findByRole('heading', { name: 'Pages', level: 2 })).toBeInTheDocument()
    })

    it('should move to added page when the OK button is pressed with editing', async () => {
      // arrange
      await setup('/NewPage')

      // act
      await userEvent.type(screen.getByRole('textbox', { name: 'Title' }), 'New page')
      await userEvent.click(screen.getByRole('button', { name: 'OK' }))

      // assert
      expect(await screen.findByRole('heading', { name: 'New page', level: 2 })).toBeInTheDocument()
    })
  })

  describe('Edit page', () => {
    it('should move to FrontPage when FrontPage button in app bar is pressed', async () => {
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

    it('should move to FrontPage when SandBox button in app bar is pressed', async () => {
      // arrange
      await setup('/pages/SandBox/edit')

      // act
      await userEvent.click(screen.getByRole('button', { name: 'FrontPage' }))

      // assert
      expect(
        await screen.findByRole('heading', { name: 'FrontPage', level: 2 }),
      ).toBeInTheDocument()
    })

    it('should return to SandBox if moved from SandBox and click the cancel button without editing', async () => {
      // arrange
      await setup('/SandBox')
      await userEvent.click(screen.getByRole('button', { name: 'Edit' }))

      // act
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

      // assert
      expect(await screen.findByRole('heading', { name: 'SandBox', level: 2 })).toBeInTheDocument()
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

    it('should discard editing content and move back to from page if the OK button in the confirmation dialog is pressed.', async () => {
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

    it('should dismiss confirmation dialog if the cancel button in the confirmation dialog is pressed.', async () => {
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

    it('should update page when the OK button pressed after editing title', async () => {
      // arrange
      await setup('/')
      await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
      const titleTextField = screen.getByRole('textbox', { name: 'Title' })
      await userEvent.clear(titleTextField)
      await userEvent.type(titleTextField, 'FrontPage(updated)')

      // act
      await userEvent.click(screen.getByRole('button', { name: 'OK' }))

      // assert
      expect(
        await screen.findByRole('heading', { name: 'FrontPage(updated)', level: 2 }),
      ).toBeInTheDocument()
    })

    it('should update page when the OK button pressed after editing content', async () => {
      // arrange
      await setup('/')
      await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
      const contentTextArea = screen.getByDisplayValue(/^&ldquo;swiki&rdquo;/)
      await userEvent.clear(contentTextArea)
      await userEvent.type(contentTextArea, 'Updated FrontPage content.')

      // act
      await userEvent.click(screen.getByRole('button', { name: 'OK' }))

      // assert
      expect(await screen.findByText(/Updated FrontPage content\./)).toBeInTheDocument()
    })
  })
})
