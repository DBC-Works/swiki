import { pageSetAtom } from '../../states/pages/atoms'
import { pageSet } from '../../states/pages/states'
import type { PageData, PageSet } from '../../states/pages/types'
import type { NonEmptyArray } from '../../types'
import { PageContentEditor } from './PageContentEditor'

import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { TestProvider, setupComponentUnderTest } from '../../testUtils'

describe('PageContentEditor component', () => {
  const setup = (pageTitle: string, initialPageSet: PageSet | null = null) =>
    setupComponentUnderTest(
      <TestProvider initialValues={[[pageSetAtom, initialPageSet ?? pageSet]]}>
        <PageContentEditor pageTitle={pageTitle} />
      </TestProvider>,
    )

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

  it('should set default page presentation data to edit on first time to edit FrontPage', () => {
    // arrange && act
    setup('FrontPage')

    // assert
    expect(
      screen.getByRole('heading', { level: 2, name: 'Source - FrontPage' }),
    ).toBeInTheDocument()
    expect(screen.getByDisplayValue('FrontPage')).toBeInTheDocument()
    expect(screen.getByDisplayValue(/^&ldquo;swiki&rdquo;/)).toBeInTheDocument()
  })

  it('should set default page presentation data to edit on first time to edit SandBox', () => {
    // arrange && act
    setup('SandBox')

    // assert
    expect(screen.getByRole('heading', { level: 2, name: 'Source - SandBox' })).toBeInTheDocument()
    expect(screen.getByDisplayValue('SandBox')).toBeInTheDocument()
    expect(
      screen.getByDisplayValue(/^Let's Try to edit to press the edit button./),
    ).toBeInTheDocument()
  })

  it('should set empty page presentation data to edit if page title is not exist', () => {
    // arrange && act
    setup('New page')

    // assert
    expect(screen.getByRole('heading', { level: 2, name: 'Source - New page' })).toBeInTheDocument()
    expect(screen.getByDisplayValue('New page')).toBeInTheDocument()
    expect(screen.getByDisplayValue('')).toBeInTheDocument()
  })

  it('should set empty page presentation data to edit if page title is not exist', () => {
    // arrange && act
    const initialPageSet = {
      frontPage: null,
      sandBox: null,
      pages: [
        {
          id: crypto.randomUUID(),
          pageDataHistory: [
            {
              language: 'en',
              title: 'Latest page',
              content: 'Latest page content',
              dateAndTime: '21001231T000000Z',
            },
            {
              language: 'en',
              title: 'First page',
              content: 'First page content',
              dateAndTime: '21000101T000000Z',
            },
          ] as NonEmptyArray<PageData>,
        },
      ],
    }
    setup('Latest page', initialPageSet)

    // assert
    expect(
      screen.getByRole('heading', { level: 2, name: 'Source - Latest page' }),
    ).toBeInTheDocument()
    expect(screen.getByDisplayValue('Latest page')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Latest page content')).toBeInTheDocument()
  })

  it('should show "editing" when the title is updated', async () => {
    // arrange
    setup('New page')

    // act
    await userEvent.type(screen.getByDisplayValue('New page'), ' for test')

    // assert
    expect(screen.getByRole('status')).toHaveTextContent('editing')
  })

  it('should show "editing" when the content is updated', async () => {
    // arrange
    setup('New page')

    // act
    await userEvent.type(screen.getByDisplayValue(''), "## What's this?")

    // assert
    expect(screen.getByRole('status')).toHaveTextContent('editing')
  })

  it('should hide "editing" once the title is restored', async () => {
    // arrange
    setup('New page')
    const titleTextField = screen.getByDisplayValue('New page')
    await userEvent.clear(titleTextField)
    await userEvent.type(titleTextField, 'Edited page title')
    expect(screen.getByRole('status')).toHaveTextContent('editing')

    // act
    await userEvent.clear(titleTextField)
    await userEvent.type(titleTextField, 'New page')

    // assert
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('should hide "editing" once the content is restored', async () => {
    // arrange
    setup('New page')
    const contentTextArea = screen.getByDisplayValue('')
    await userEvent.type(contentTextArea, "## What's this?")
    expect(screen.getByRole('status')).toHaveTextContent('editing')

    // act
    await userEvent.clear(contentTextArea)

    // assert
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('should enable the OK button when title is valid', async () => {
    // arrange
    setup('New page')
    const titleTextField = screen.getByDisplayValue('New page')
    expect(screen.getByRole('button', { name: 'OK' })).toBeEnabled()

    // act
    await userEvent.clear(titleTextField)
    await userEvent.type(titleTextField, 'New page title')

    // assert
    expect(screen.getByRole('button', { name: 'OK' })).toBeEnabled()
  })

  it('should disable the OK button when title is empty', async () => {
    // arrange
    setup('New page')
    const titleTextField = screen.getByDisplayValue('New page')
    expect(screen.getByRole('button', { name: 'OK' })).toBeEnabled()

    // act
    await userEvent.clear(titleTextField)

    // assert
    expect(screen.getByRole('button', { name: 'OK' })).toBeDisabled()
  })

  it('should disable the OK button when title is duplicated', async () => {
    // arrange
    setup('New page')
    const titleTextField = screen.getByDisplayValue('New page')
    expect(screen.getByRole('button', { name: 'OK' })).toBeEnabled()

    // act
    await userEvent.clear(titleTextField)
    await userEvent.type(titleTextField, 'FrontPage')

    // assert
    expect(screen.getByRole('button', { name: 'OK' })).toBeDisabled()
  })
})
