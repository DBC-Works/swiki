import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'

import { getByRole, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import './i18n'
import { routeTree } from './routeTree.gen'
import type { PageSet } from './states/pages/types'
import {
  type SetUpResult,
  fireToggleEvent,
  setupComponentWithStateProviderUnderTest,
} from './testUtils'

describe('route', () => {
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
          {
            language: 'en',
            title: 'Content page(1st)',
            content: 'Content page content',
            dateAndTime: '2024-12-31T00:00:00Z',
          },
        ],
      },
    ],
  }

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

  describe('navigation', () => {
    describe('top app bar', () => {
      it.for([
        { from: 'FrontPage', to: 'Pages', fromPath: '/' },
        { from: 'FrontPage', to: 'History', fromPath: '/' },
        { from: 'SandBox', to: 'FrontPage', fromPath: '/SandBox' },
        { from: 'SandBox', to: 'Pages', fromPath: '/SandBox' },
        { from: 'SandBox', to: 'History', fromPath: '/SandBox' },
        { from: 'Pages', to: 'FrontPage', fromPath: '/pages' },
        { from: 'Pages', to: 'History', fromPath: '/pages' },
        { from: 'Page', to: 'FrontPage', fromPath: '/pages/Content%20page' },
        { from: 'Page', to: 'Pages', fromPath: '/pages/Content%20page' },
        { from: 'Page', to: 'History', fromPath: '/pages/Content%20page' },
        { from: 'Page', to: 'FrontPage', fromPath: '/pages/Content%20page/diff/2/1' },
        { from: 'Page', to: 'Pages', fromPath: '/pages/Content%20page/diff/2/1' },
        { from: 'Page', to: 'History', fromPath: '/pages/Content%20page/diff/2/1' },
      ])(
        'should move to $to page from $from when $heading button in app bar is pressed',
        async ({ to, fromPath }) => {
          // arrange
          await setup(fromPath, initialPageSet)

          // act
          await userEvent.click(screen.getByRole('button', { name: to }))

          // assert
          expect(screen.getByRole('heading', { name: to, level: 2 })).toBeInTheDocument()
        },
      )
    })
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

  describe('SandBox', () => {
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
    describe('navigation', () => {
      describe('page list', () => {
        it.for([{ to: 'FrontPage' }, { to: 'SandBox' }, { to: 'Content page' }])(
          'should move to $to when $title button in page list is pressed',
          async ({ to }) => {
            // arrange
            await setup('/pages', initialPageSet)

            // act
            await userEvent.click(screen.getByRole('button', { name: new RegExp(`^${to}.+`) }))

            // assert
            expect(screen.getByRole('heading', { name: to, level: 2 })).toBeInTheDocument()
          },
        )
      })
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

  describe('History', () => {
    describe('navigation', () => {
      describe('page list', () => {
        it.for([{ to: 'FrontPage' }, { to: 'SandBox' }, { to: 'Content page' }])(
          'should move to $to when $title button in page list is pressed',
          async ({ to }) => {
            // arrange
            await setup('/history', initialPageSet)

            // act
            await userEvent.click(screen.getByRole('button', { name: new RegExp(`^${to}.+`) }))

            // assert
            expect(screen.getByRole('heading', { name: to, level: 2 })).toBeInTheDocument()
          },
        )
      })
    })

    it('should move to add new page when add Fab is pressed', async () => {
      // arrange
      await setup('/history')

      // act
      await userEvent.click(screen.getByLabelText('Add new page'))

      // assert
      expect(screen.getByRole('heading', { name: 'New page', level: 2 })).toBeInTheDocument()
    })
  })

  describe('Content page', () => {
    it('should move to new page if there is no page with the specified title', async () => {
      // arrange & act
      await setup('/pages/NotExist', initialPageSet)

      // assert
      expect(await screen.findByRole('heading', { name: 'New page', level: 2 })).toBeInTheDocument()
    })

    it.for([
      { targetRevision: 2, selectRevision: 1 },
      { targetRevision: 1, selectRevision: 2 },
    ])(
      'should move to diff page when revision selector in page history item is selected',
      async ({ targetRevision, selectRevision }) => {
        // arrange
        await setup('/pages/Content%20page', initialPageSet)
        fireToggleEvent(screen.getByText(/update at/).closest('details') as HTMLDetailsElement)
        const re = new RegExp(`Rev.${targetRevision}:`)
        const listItem = screen.getByText(re).closest('li') as HTMLLIElement
        const select = getByRole(listItem, 'combobox', { name: 'Compare with...' })
        await userEvent.click(select)

        // act
        await userEvent.click(screen.getByText(`Rev.${selectRevision}`))

        // assert
        expect(
          screen.getByRole('heading', {
            name: 'Diff between Rev.1 and Rev.2 of “Content page”',
            level: 2,
          }),
        ).toBeInTheDocument()
      },
    )

    it('should move to the specified page when the link of the page in content clicked', async () => {
      // arrange
      const pageSet = {
        frontPage: null,
        sandBox: null,
        pages: [
          {
            id: crypto.randomUUID(),
            pageDataHistory: [
              {
                language: 'en',
                title: 'Source page',
                content:
                  '[External link](https://www.example.com)\nPlease click [[Destination page]].\nPlease do not click [[Not exist page]].',
                dateAndTime: '2025-02-01T00:00:00Z',
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            pageDataHistory: [
              {
                language: 'en',
                title: 'Destination page',
                content: 'Destination page content.',
                dateAndTime: '2025-01-01T00:00:00Z',
              },
            ],
          },
        ],
      }
      await setup('/pages/Source%20page', pageSet)
      expect(screen.getByRole('link', { name: 'Not exist page' })).toBeInTheDocument()

      // act
      await userEvent.click(screen.getByRole('link', { name: 'Destination page' }))

      // assert
      expect(
        screen.getByRole('heading', {
          name: 'Destination page',
          level: 2,
        }),
      ).toBeInTheDocument()
    })

    it('should move to new page when the link of the page in content that does not exist clicked', async () => {
      // arrange
      const pageSet = {
        frontPage: null,
        sandBox: null,
        pages: [
          {
            id: crypto.randomUUID(),
            pageDataHistory: [
              {
                language: 'en',
                title: 'Source page',
                content: 'Please click [[Not exist page]] to add new page.',
                dateAndTime: '2025-02-01T00:00:00Z',
              },
            ],
          },
        ],
      }
      await setup('/pages/Source%20page', pageSet)

      // act
      await userEvent.click(screen.getByRole('link', { name: 'Not exist page' }))

      // assert
      expect(screen.getByRole('heading', { name: 'New page', level: 2 })).toBeInTheDocument()
      expect(screen.getByDisplayValue('Not exist page')).toBeInTheDocument()
    })

    it('should translate the link markup to the "a" element with the "target" attribute with the value "_blank"', async () => {
      // arrange & act
      const pageSet = {
        frontPage: null,
        sandBox: null,
        pages: [
          {
            id: crypto.randomUUID(),
            pageDataHistory: [
              {
                language: 'en',
                title: 'Page',
                content: '[External link](https://www.example.com)',
                dateAndTime: '2025-01-01T00:00:00Z',
              },
            ],
          },
        ],
      }
      await setup('/pages/Page', pageSet)

      // assert
      const actual = screen.getByRole('link', {
        name: 'External link',
      })
      expect(actual).toBeInTheDocument()
      expect(actual).toHaveAttribute('target', '_blank')
    })
  })

  describe('Page diff page', () => {
    it('should move to pages page if the specified title page does not exist', async () => {
      // arrange & act
      await setup('/pages/NotExist/diff/2/1', initialPageSet)

      // assert
      expect(screen.getByRole('heading', { name: 'Pages', level: 2 })).toBeInTheDocument()
    })

    it.for([
      { from: 'NaN', to: 'NaN' },
      { from: 1, to: 'NaN' },
      { from: 'NaN', to: 2 },
      { from: 2, to: 2 },
      { from: 0, to: 3 },
      { from: 3, to: 0 },
      { from: 1, to: -1 },
      { from: -1, to: 2 },
    ])(
      'should move to the specified title page if the title exists but the revision is invalid',
      async ({ from, to }) => {
        // arrange & act
        await setup(`/pages/Content%20page/diff/${to}/${from}`, initialPageSet)

        // assert
        expect(
          await screen.findByRole('heading', { name: 'Content page', level: 2 }),
        ).toBeInTheDocument()
      },
    )

    it('should move to the specified title page if the link pressed', async () => {
      // arrange
      await setup('/pages/Content%20page/diff/2/1', initialPageSet)

      // act
      await userEvent.click(screen.getByText('Back to “Content page”'))

      // assert
      expect(screen.getByRole('heading', { name: 'Content page', level: 2 })).toBeInTheDocument()
    })
  })

  describe('Add new page', () => {
    it.for([{ to: 'FrontPage' }, { to: 'Pages' }, { to: 'History' }])(
      'should move to $to when $from button in app bar is pressed without editing',
      async ({ to }) => {
        // arrange
        await setup('/NewPage')

        // act
        await userEvent.click(screen.getByRole('button', { name: to }))

        // assert
        expect(await screen.findByRole('heading', { name: to, level: 2 })).toBeInTheDocument()
      },
    )

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
    it.for([{ to: 'FrontPage' }, { to: 'Pages' }, { to: 'History' }])(
      'should move to $to when $from button in app bar is pressed without editing',
      async ({ to }) => {
        // arrange
        await setup('/pages/FrontPage/edit')

        // act
        await userEvent.click(screen.getByRole('button', { name: to }))

        // assert
        expect(await screen.findByRole('heading', { name: to, level: 2 })).toBeInTheDocument()
      },
    )

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

    it('should not show discard confirm dialog when FrontPage button in app bar pressed after update content title', async () => {
      // arrange
      await setup('/pages/Content%20page', initialPageSet)
      await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
      await userEvent.type(screen.getByRole('textbox', { name: 'Title' }), '(updated)')
      await userEvent.click(screen.getByRole('button', { name: 'OK' }))
      expect(
        await screen.findByRole('heading', { name: 'Content page(updated)', level: 2 }),
      ).toBeInTheDocument()

      // act
      await userEvent.click(screen.getByRole('button', { name: 'FrontPage' }))

      // assert
      await waitFor(() => {
        expect(
          screen.queryByText('Are you sure you want to discard your edits?'),
        ).not.toBeInTheDocument()
      })
    })
  })
})
