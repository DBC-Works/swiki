import { isEqual } from 'es-toolkit'

import { type Page, type PageData, type PageSet, PageTypes, type VersionedPageList } from './types'

/**
 * Merge page data history
 * @param currentHistory Page data history of current page
 * @param importHistory Page data history of import page
 * @returns Merged page data history
 */
const mergePageDataHistory = (
  currentHistory: PageData[],
  importHistory: PageData[],
): PageData[] => {
  let lastPageData: PageData | null = null
  return currentHistory
    .concat(importHistory)
    .toSorted((lhs, rhs) => -lhs.dateAndTime.localeCompare(rhs.dateAndTime))
    .filter((pageData) => {
      const single = lastPageData === null || isEqual(lastPageData, pageData) === false
      if (single) {
        lastPageData = pageData
      }
      return single
    })
}

/**
 * Create merge page
 * @param importPage Import page
 * @param currentPage Current page
 * @returns Merged page
 */
const createMergePage = (importPage: Page, currentPage: Page): Page => ({
  ...currentPage,
  pageDataHistory: mergePageDataHistory(currentPage.pageDataHistory, importPage.pageDataHistory),
})

/**
 * Get target page
 * @param importPage Import page
 * @param currentPage Current page
 * @returns Target page
 */
const getTargetPage = (importPage: Page | null, currentPage: Page | null): Page | null =>
  importPage !== null
    ? currentPage !== null
      ? createMergePage(importPage, currentPage)
      : importPage
    : currentPage

/**
 * Generate merged page set
 * @param importPageList Import page list
 * @param current Current page set
 * @returns Merged page set
 */
export const generateMergedPageSet = (
  importPageList: VersionedPageList,
  current: PageSet,
): PageSet => {
  const toPages = [...current.pages]

  const mergedPageSet: PageSet = {
    frontPage: null,
    sandBox: null,
    pages: [],
  }

  for (const typedPage of importPageList.pages) {
    switch (typedPage.type) {
      case PageTypes.FrontPage:
        mergedPageSet.frontPage = getTargetPage(typedPage.page, current.frontPage)
        break

      case PageTypes.SandBox:
        mergedPageSet.sandBox = getTargetPage(typedPage.page, current.sandBox)
        break

      case PageTypes.Content:
        {
          const toPageIndex = toPages.findIndex((page) => page.id === typedPage.page?.id)
          mergedPageSet.pages.push(
            getTargetPage(
              typedPage.page,
              0 <= toPageIndex ? toPages.splice(toPageIndex, 1)[0] : null,
            ) as Page,
          )
        }
        break

      default:
        throw new Error(`Unknown page type: ${typedPage.type}`)
    }
  }

  let lastPage: Page | null = null
  mergedPageSet.pages = mergedPageSet.pages
    .concat(toPages)
    .toSorted(
      (lhs, rhs) =>
        -lhs.pageDataHistory[0].dateAndTime.localeCompare(rhs.pageDataHistory[0].dateAndTime),
    )
    .filter((page) => {
      const single = lastPage === null || isEqual(lastPage, page) === false
      if (single) {
        lastPage = page
      }
      return single
    })
  return mergedPageSet
}
