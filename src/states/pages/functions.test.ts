import { describe, expect, it } from 'vitest'
import { generateMergedPageSet } from './functions'
import { DataFormatVersions, type PageSet, PageTypes, type VersionedPageList } from './types'

describe('atoms', () => {
  describe('generateMergedPageSet', () => {
    const EMPTY_PAGE_SET: PageSet = Object.freeze({
      frontPage: null,
      sandBox: null,
      pages: [],
    })

    const EMPTY_VERSIONED_PAGE_LIST: VersionedPageList = Object.freeze({
      version: DataFormatVersions.v202503,
      pages: [
        {
          type: PageTypes.FrontPage,
          page: null,
        },
        {
          type: PageTypes.SandBox,
          page: null,
        },
      ],
    })

    it('should not change if the import page list is empty', () => {
      // arrange & act
      const actual = generateMergedPageSet(EMPTY_VERSIONED_PAGE_LIST, EMPTY_PAGE_SET)

      // assert
      expect(actual).toEqual(EMPTY_PAGE_SET)
    })

    describe('FrontPage', () => {
      it('should not change if the import page data is empty', () => {
        // arrange
        const currentPageSet = {
          ...EMPTY_PAGE_SET,
          frontPage: {
            id: crypto.randomUUID(),
            pageDataHistory: [
              {
                language: 'en',
                title: 'First page',
                content: 'Content of first page',
                dateAndTime: '2025-04-01T00:00:00Z',
              },
            ],
          },
        }

        // act
        const actual = generateMergedPageSet(EMPTY_VERSIONED_PAGE_LIST, currentPageSet)

        // assert
        expect(actual).toEqual(currentPageSet)
      })

      it('should copy page data in the import page list if the current page set has no page', () => {
        // arrange
        const importFrontPage = {
          id: crypto.randomUUID(),
          pageDataHistory: [
            {
              language: 'en',
              title: 'First page',
              content: 'Content of first page',
              dateAndTime: '2025-04-01T00:00:00Z',
            },
          ],
        }
        const versionedPageList = {
          version: DataFormatVersions.v202503,
          pages: [
            {
              type: PageTypes.FrontPage,
              page: importFrontPage,
            },
            {
              type: PageTypes.SandBox,
              page: null,
            },
          ],
        }

        // act
        const actual = generateMergedPageSet(versionedPageList, EMPTY_PAGE_SET)

        // assert
        expect(actual).toEqual({
          frontPage: importFrontPage,
          sandBox: null,
          pages: [],
        })
      })

      it('should merge page data history if the page data in import page list and the page dat in current page set both have history', () => {
        // arrange
        const commonPageData = {
          language: 'en',
          title: 'Common page',
          content: 'Content of common page',
          dateAndTime: '2025-04-01T00:00:00Z',
        }

        const currentFrontPage = {
          id: crypto.randomUUID(),
          pageDataHistory: [
            {
              language: 'en',
              title: 'Second page of current front page',
              content: 'Content of second page',
              dateAndTime: '2025-05-01T00:00:00Z',
            },
            commonPageData,
            {
              language: 'en',
              title: 'First page of current front page',
              content: 'Content of first page',
              dateAndTime: '2025-01-01T00:00:00Z',
            },
          ],
        }
        const currentPageSet = {
          frontPage: currentFrontPage,
          sandBox: null,
          pages: [],
        }
        const importFrontPage = {
          id: crypto.randomUUID(),
          pageDataHistory: [
            commonPageData,
            {
              language: 'en',
              title: 'Second page of import front page',
              content: 'Content of second page',
              dateAndTime: '2025-03-01T00:00:00Z',
            },
            {
              language: 'en',
              title: 'First page of import front page',
              content: 'Content of first page',
              dateAndTime: '2025-02-01T00:00:00Z',
            },
          ],
        }
        const versionedPageList = {
          version: DataFormatVersions.v202503,
          pages: [
            {
              type: PageTypes.FrontPage,
              page: importFrontPage,
            },
            {
              type: PageTypes.SandBox,
              page: null,
            },
          ],
        }

        // act
        const actual = generateMergedPageSet(versionedPageList, currentPageSet)

        // assert
        expect(actual).toEqual({
          frontPage: {
            id: currentFrontPage.id,
            pageDataHistory: [
              currentFrontPage.pageDataHistory[0],
              currentFrontPage.pageDataHistory[1],
              importFrontPage.pageDataHistory[1],
              importFrontPage.pageDataHistory[2],
              currentFrontPage.pageDataHistory[2],
            ],
          },
          sandBox: null,
          pages: [],
        })
      })
    })

    describe('SandBox', () => {
      it('should not change if the import page data is empty', () => {
        // arrange
        const currentPageSet = {
          ...EMPTY_PAGE_SET,
          sandBox: {
            id: crypto.randomUUID(),
            pageDataHistory: [
              {
                language: 'en',
                title: 'First page',
                content: 'Content of first page',
                dateAndTime: '2025-04-01T00:00:00Z',
              },
            ],
          },
        }

        // act
        const actual = generateMergedPageSet(EMPTY_VERSIONED_PAGE_LIST, currentPageSet)

        // assert
        expect(actual).toEqual(currentPageSet)
      })

      it('should copy page data in the import page list if the current page set has no page', () => {
        // arrange
        const importSandBox = {
          id: crypto.randomUUID(),
          pageDataHistory: [
            {
              language: 'en',
              title: 'First page',
              content: 'Content of first page',
              dateAndTime: '2025-04-01T00:00:00Z',
            },
          ],
        }
        const versionedPageList = {
          version: DataFormatVersions.v202503,
          pages: [
            {
              type: PageTypes.FrontPage,
              page: null,
            },
            {
              type: PageTypes.SandBox,
              page: importSandBox,
            },
          ],
        }

        // act
        const actual = generateMergedPageSet(versionedPageList, EMPTY_PAGE_SET)

        // assert
        expect(actual).toEqual({
          frontPage: null,
          sandBox: importSandBox,
          pages: [],
        })
      })

      it('should merge page data history if the page data in import page list and the page dat in current page set both have history', () => {
        // arrange
        const commonPageData = {
          language: 'en',
          title: 'Common page',
          content: 'Content of common page',
          dateAndTime: '2025-04-01T00:00:00Z',
        }

        const currentSandBox = {
          id: crypto.randomUUID(),
          pageDataHistory: [
            {
              language: 'en',
              title: 'Second page of current sand box',
              content: 'Content of second page',
              dateAndTime: '2025-05-01T00:00:00Z',
            },
            commonPageData,
            {
              language: 'en',
              title: 'First page of current sand box',
              content: 'Content of first page',
              dateAndTime: '2025-01-01T00:00:00Z',
            },
          ],
        }
        const currentPageSet = {
          frontPage: null,
          sandBox: currentSandBox,
          pages: [],
        }
        const importSandBox = {
          id: crypto.randomUUID(),
          pageDataHistory: [
            commonPageData,
            {
              language: 'en',
              title: 'Second page of import sand box',
              content: 'Content of second page',
              dateAndTime: '2025-03-01T00:00:00Z',
            },
            {
              language: 'en',
              title: 'First page of import sand box',
              content: 'Content of first page',
              dateAndTime: '2025-02-01T00:00:00Z',
            },
          ],
        }
        const versionedPageList = {
          version: DataFormatVersions.v202503,
          pages: [
            {
              type: PageTypes.FrontPage,
              page: null,
            },
            {
              type: PageTypes.SandBox,
              page: importSandBox,
            },
          ],
        }

        // act
        const actual = generateMergedPageSet(versionedPageList, currentPageSet)

        // assert
        expect(actual).toEqual({
          frontPage: null,
          sandBox: {
            id: currentSandBox.id,
            pageDataHistory: [
              currentSandBox.pageDataHistory[0],
              currentSandBox.pageDataHistory[1],
              importSandBox.pageDataHistory[1],
              importSandBox.pageDataHistory[2],
              currentSandBox.pageDataHistory[2],
            ],
          },
          pages: [],
        })
      })
    })

    describe('Pages', () => {
      it('should not change if the import page list is empty', () => {
        // arrange
        const currentPage = {
          id: crypto.randomUUID(),
          pageDataHistory: [
            {
              language: 'en',
              title: 'Current page',
              content: 'Content of current page',
              dateAndTime: '2025-05-01T00:00:00Z',
            },
          ],
        }
        const currentPageSet = {
          frontPage: null,
          sandBox: null,
          pages: [currentPage],
        }

        // act
        const actual = generateMergedPageSet(EMPTY_VERSIONED_PAGE_LIST, currentPageSet)

        // assert
        expect(actual).toEqual({
          frontPage: null,
          sandBox: null,
          pages: [currentPage],
        })
      })

      it('should copy the page data in import page list if the current page set is empty', () => {
        // arrange
        const importPage = {
          id: crypto.randomUUID(),
          pageDataHistory: [
            {
              language: 'en',
              title: 'Import page',
              content: 'Content of import page',
              dateAndTime: '2025-05-01T00:00:00Z',
            },
          ],
        }
        const versionedPageList = {
          version: DataFormatVersions.v202503,
          pages: [
            {
              type: PageTypes.Content,
              page: importPage,
            },
          ],
        }

        // act
        const actual = generateMergedPageSet(versionedPageList, EMPTY_PAGE_SET)

        // assert
        expect(actual).toEqual({
          frontPage: null,
          sandBox: null,
          pages: [importPage],
        })
      })

      it('should append the page data in import page list to current page set if UUID of import page does not exist in the current page set', () => {
        // arrange
        const currentPage = {
          id: crypto.randomUUID(),
          pageDataHistory: [
            {
              language: 'en',
              title: 'Current page',
              content: 'Content of current page',
              dateAndTime: '2025-04-30T00:00:00Z',
            },
          ],
        }
        const currentPageSet = {
          frontPage: null,
          sandBox: null,
          pages: [currentPage],
        }
        const importPage = {
          id: crypto.randomUUID(),
          pageDataHistory: [
            {
              language: 'en',
              title: 'Import page',
              content: 'Content of import page',
              dateAndTime: '2025-05-01T00:00:00Z',
            },
          ],
        }
        const versionedPageList = {
          version: DataFormatVersions.v202503,
          pages: [
            {
              type: PageTypes.Content,
              page: importPage,
            },
          ],
        }

        // act
        const actual = generateMergedPageSet(versionedPageList, currentPageSet)

        // assert
        expect(actual).toEqual({
          frontPage: null,
          sandBox: null,
          pages: [importPage, currentPage],
        })
      })

      it('should merge page data history if the import page list and the current page set both have same page', () => {
        // arrange
        const uuid = crypto.randomUUID()
        const currentPage = {
          id: uuid,
          pageDataHistory: [
            {
              language: 'en',
              title: 'Current page',
              content: 'Content of current page',
              dateAndTime: '2025-04-30T00:00:00Z',
            },
          ],
        }
        const currentPageSet = {
          frontPage: null,
          sandBox: null,
          pages: [currentPage],
        }
        const importPage = {
          id: uuid,
          pageDataHistory: [
            {
              language: 'en',
              title: 'Import page',
              content: 'Content of import page',
              dateAndTime: '2025-05-01T00:00:00Z',
            },
          ],
        }
        const versionedPageList = {
          version: DataFormatVersions.v202503,
          pages: [
            {
              type: PageTypes.Content,
              page: importPage,
            },
          ],
        }

        // act
        const actual = generateMergedPageSet(versionedPageList, currentPageSet)

        // assert
        expect(actual).toEqual({
          frontPage: null,
          sandBox: null,
          pages: [
            {
              id: uuid,
              pageDataHistory: [
                {
                  language: 'en',
                  title: 'Import page',
                  content: 'Content of import page',
                  dateAndTime: '2025-05-01T00:00:00Z',
                },
                {
                  language: 'en',
                  title: 'Current page',
                  content: 'Content of current page',
                  dateAndTime: '2025-04-30T00:00:00Z',
                },
              ],
            },
          ],
        })
      })
    })
  })
})
