import { createStore } from 'jotai'

import { describe, expect, it } from 'vitest'

import { addPageDataAtom, pageSetAtom } from './atoms'
import { type Page, PageTypes } from './types'

describe('atoms', () => {
  describe('add new page data wite-only atom', () => {
    describe('Contents', () => {
      it('should add new page if page dose not exist', () => {
        // arrange
        const { get, set } = createStore()

        // act
        set(addPageDataAtom, PageTypes.Content, null, 'en', 'New page', 'Content of new page')

        // assert
        const { pages } = get(pageSetAtom)
        expect(pages).toHaveLength(1)
        const { pageDataHistory } = pages[0]
        expect(pageDataHistory).toHaveLength(1)
        const pageData = pageDataHistory[0]
        expect(pageData.language).toEqual('en')
        expect(pageData.title).toEqual('New page')
        expect(pageData.content).toEqual('Content of new page')
        expect(pageData.dateAndTime.length).toBeGreaterThan(0)
      })

      it('should add new page if page already exists', () => {
        // arrange
        const { get, set } = createStore()
        set(pageSetAtom, {
          frontPage: null,
          sandBox: null,
          pages: [
            {
              id: crypto.randomUUID(),
              pageDataHistory: [
                {
                  language: 'en',
                  title: 'First page',
                  content: 'Content of first page',
                  dateAndTime: '2024-01-01T00:00:00Z',
                },
              ],
            },
          ],
        })

        // act
        set(addPageDataAtom, PageTypes.Content, null, 'en', 'Second page', 'Content of second page')

        // assert
        const { pages } = get(pageSetAtom)
        expect(pages).toHaveLength(2)
        const { pageDataHistory: firstPageDataHistory } = pages[0]
        expect(firstPageDataHistory).toHaveLength(1)
        const firstPageData = firstPageDataHistory[0]
        expect(firstPageData.language).toEqual('en')
        expect(firstPageData.title).toEqual('First page')
        expect(firstPageData.content).toEqual('Content of first page')
        expect(firstPageData.dateAndTime.length).toBeGreaterThan(0)

        const { pageDataHistory: secondPageDataHistory } = pages[1]
        expect(secondPageDataHistory).toHaveLength(1)
        const secondPageData = secondPageDataHistory[0]
        expect(secondPageData.language).toEqual('en')
        expect(secondPageData.title).toEqual('Second page')
        expect(secondPageData.content).toEqual('Content of second page')
        expect(secondPageData.dateAndTime.length).toBeGreaterThan(0)
      })

      it('should add new page data to the beginning of date history of the page with the given title', () => {
        // arrange
        const { get, set } = createStore()
        const id = crypto.randomUUID()
        set(pageSetAtom, {
          frontPage: null,
          sandBox: null,
          pages: [
            {
              id,
              pageDataHistory: [
                {
                  language: 'en',
                  title: 'Initial page',
                  content: 'Content of initial page',
                  dateAndTime: '2024-01-01T00:00:00Z',
                },
              ],
            },
          ],
        })

        // act
        set(addPageDataAtom, PageTypes.Content, id, 'ja', 'Updated page', 'Content of updated page')

        //assert
        const { pages } = get(pageSetAtom)
        expect(pages).toHaveLength(1)
        const { pageDataHistory } = pages[0]
        expect(pageDataHistory).toHaveLength(2)
        const pageData = pageDataHistory[0]
        expect(pageData.language).toEqual('ja')
        expect(pageData.title).toEqual('Updated page')
        expect(pageData.content).toEqual('Content of updated page')
        expect(pageData.dateAndTime.length).toBeGreaterThan(0)
      })
    })
  })

  describe('FrontPage', () => {
    it('should add new page data if it dose not exist', () => {
      // arrange
      const { get, set } = createStore()

      // act
      set(addPageDataAtom, PageTypes.FrontPage, null, 'en', 'New page', 'Content of new page')

      // assert
      const { frontPage } = get(pageSetAtom)
      expect(frontPage).not.toBeNull()
      const { pageDataHistory } = frontPage as Page
      expect(pageDataHistory).toHaveLength(1)
      const pageData = pageDataHistory[0]
      expect(pageData.language).toEqual('en')
      expect(pageData.title).toEqual('New page')
      expect(pageData.content).toEqual('Content of new page')
      expect(pageData.dateAndTime.length).toBeGreaterThan(0)
    })

    it('should add new page data to the beginning of date history of the page with the given title', () => {
      // arrange
      const { get, set } = createStore()
      const id = crypto.randomUUID()
      set(pageSetAtom, {
        frontPage: {
          id,
          pageDataHistory: [
            {
              language: 'en',
              title: 'Initial page',
              content: 'Content of initial page',
              dateAndTime: '2024-01-01T00:00:00Z',
            },
          ],
        },
        sandBox: null,
        pages: [],
      })

      // act
      set(addPageDataAtom, PageTypes.FrontPage, id, 'ja', 'Updated page', 'Content of updated page')

      //assert
      const { frontPage } = get(pageSetAtom)
      expect(frontPage).not.toBeNull()
      const { pageDataHistory } = frontPage as Page
      expect(pageDataHistory).toHaveLength(2)
      const pageData = pageDataHistory[0]
      expect(pageData.language).toEqual('ja')
      expect(pageData.title).toEqual('Updated page')
      expect(pageData.content).toEqual('Content of updated page')
      expect(pageData.dateAndTime.length).toBeGreaterThan(0)
    })
  })

  describe('SandBox', () => {
    it('should add new page data if it dose not exist', () => {
      // arrange
      const { get, set } = createStore()

      // act
      set(addPageDataAtom, PageTypes.SandBox, null, 'en', 'New page', 'Content of new page')

      // assert
      const { sandBox } = get(pageSetAtom)
      expect(sandBox).not.toBeNull()
      const { pageDataHistory } = sandBox as Page
      expect(pageDataHistory).toHaveLength(1)
      const pageData = pageDataHistory[0]
      expect(pageData.language).toEqual('en')
      expect(pageData.title).toEqual('New page')
      expect(pageData.content).toEqual('Content of new page')
      expect(pageData.dateAndTime.length).toBeGreaterThan(0)
    })

    it('should add new page data to the beginning of date history of the page with the given title', () => {
      // arrange
      const { get, set } = createStore()
      const id = crypto.randomUUID()
      set(pageSetAtom, {
        frontPage: null,
        sandBox: {
          id,
          pageDataHistory: [
            {
              language: 'en',
              title: 'Initial page',
              content: 'Content of initial page',
              dateAndTime: '2024-01-01T00:00:00Z',
            },
          ],
        },
        pages: [],
      })

      // act
      set(addPageDataAtom, PageTypes.SandBox, id, 'ja', 'Updated page', 'Content of updated page')

      //assert
      const { sandBox } = get(pageSetAtom)
      expect(sandBox).not.toBeNull()
      const { pageDataHistory } = sandBox as Page
      expect(pageDataHistory).toHaveLength(2)
      const pageData = pageDataHistory[0]
      expect(pageData.language).toEqual('ja')
      expect(pageData.title).toEqual('Updated page')
      expect(pageData.content).toEqual('Content of updated page')
      expect(pageData.dateAndTime.length).toBeGreaterThan(0)
    })
  })
})
