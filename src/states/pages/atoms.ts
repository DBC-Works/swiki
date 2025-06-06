import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { generateMergedPageSet } from './functions'
import { pageSet } from './states'
import {
  DataFormatVersions,
  type Page,
  type PageData,
  type PageEditSource,
  type PageInfoForList,
  type PageSet,
  type PageType,
  PageTypes,
  type TypedPage,
  type VersionedPageList,
} from './types'

dayjs.extend(utc)

/**
 * Get latest page data
 * @param page Page
 * @returns Latest page data(null if not exist)
 */
const getLatestPageDataFrom = (page: Page | null): PageData | null =>
  page?.pageDataHistory[0] ?? null

/**
 * Get flatten page list with page type
 * @param pageSet PageSet
 * @returns Flatten page list
 */
const getFlattenPageList = (pageSet: PageSet): Array<TypedPage> => [
  {
    type: PageTypes.FrontPage,
    page: pageSet.frontPage,
  },
  {
    type: PageTypes.SandBox,
    page: pageSet.sandBox,
  },
  ...pageSet.pages.map((page) => ({
    type: PageTypes.Content,
    page,
  })),
]

/**
 * Get page edit source list
 * @param pageSet PageSet
 * @returns Page edit source list
 */
const getPageEditSources = (pageSet: PageSet): PageEditSource[] =>
  getFlattenPageList(pageSet).map(({ type, page }) => ({
    type,
    id: page?.id ?? null,
    pagePresentation: getLatestPageDataFrom(page),
  }))

/**
 * Page set atom
 */
export const pageSetAtom = atomWithStorage('pageSet', pageSet)

/**
 * Get FrontPage read-only atom
 */
export const frontPageAtom = atom((get) => {
  const { frontPage } = get(pageSetAtom)
  return getLatestPageDataFrom(frontPage)
})

/**
 * Get SandFox read-only atom
 */
export const sandBoxAtom = atom((get) => {
  const { sandBox } = get(pageSetAtom)
  return getLatestPageDataFrom(sandBox)
})

/**
 * Page list read-only atom
 */
export const pageListAtom = atom((get): PageInfoForList[] =>
  getFlattenPageList(get(pageSetAtom)).map(({ type, page }) => {
    const latestPageData = getLatestPageDataFrom(page) ?? null
    return {
      type,
      page: latestPageData,
      createDateAndTime:
        type !== PageTypes.Content ? null : (page?.pageDataHistory[0].dateAndTime ?? null),
      lastUpdateDateAndTime: latestPageData?.dateAndTime ?? null,
      updateCount: page?.pageDataHistory.length ?? null,
    }
  }),
)

/**
 * Latest pages(without special pages) read-only atom
 */
export const latestPagesAtom = atom((get) =>
  get(pageSetAtom).pages.map((page) => getLatestPageDataFrom(page)),
)

/**
 * Flatten page list read-only atom
 */
export const flattenPageListAtom = atom((get) => getFlattenPageList(get(pageSetAtom)))

/**
 * Page edit sources read-only atom
 */
export const pageEditSourcesAtom = atom((get) => getPageEditSources(get(pageSetAtom)))

/**
 * Latest page title list read-only atom
 */
export const latestPageTitlesAtom = atom((get) =>
  getFlattenPageList(get(pageSetAtom))
    .map(({ type, page }) => ({
      type,
      title: getLatestPageDataFrom(page)?.title ?? null,
    }))
    .filter(({ type, title }) => type !== PageTypes.Content || title !== null),
)

/**
 * Add page data write-only atom
 */
export const addPageDataAtom = atom(
  null,
  (
    get,
    set,
    type: PageType,
    id: string | null,
    newLanguage: string,
    newTitle: string,
    newContent: string,
  ) => {
    const newPageData = {
      language: newLanguage,
      title: newTitle,
      content: newContent,
      dateAndTime: dayjs.utc().format(),
    }

    let { frontPage, sandBox, pages } = get(pageSetAtom)
    let page: Page | null
    switch (type) {
      case PageTypes.FrontPage:
        page = frontPage
        break

      case PageTypes.SandBox:
        page = sandBox
        break

      default:
        page = pages.find((page) => page.id === id) ?? null
        break
    }

    if (page !== null) {
      page.pageDataHistory.unshift(newPageData)
    } else {
      const newPage = {
        id: crypto.randomUUID(),
        pageDataHistory: [newPageData],
      }
      switch (type) {
        case PageTypes.FrontPage:
          frontPage = newPage
          break

        case PageTypes.SandBox:
          sandBox = newPage
          break

        default:
          pages.push(newPage)
          break
      }
    }

    set(pageSetAtom, {
      frontPage,
      sandBox,
      pages,
    })
  },
)

/**
 * Get page data for export read-only atom
 */
export const getPageDataForExportAtom = atom((get) =>
  JSON.stringify({
    version: DataFormatVersions.v202503,
    pages: getFlattenPageList(get(pageSetAtom)),
  }),
)

/**
 * Merge import page data async write-only atom
 */
export const mergeImportPageDataAtom = atom(
  null,
  async (get, set, versionedPageList: VersionedPageList) => {
    set(pageSetAtom, generateMergedPageSet(versionedPageList, get(pageSetAtom)))
  },
)
