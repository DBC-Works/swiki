import { useMediaQuery, useTheme } from '@mui/material'
import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'

import {
  flattenPageListAtom,
  frontPageAtom,
  latestPageTitlesAtom,
  pageEditSourcesAtom,
  pageListAtom,
  sandBoxAtom,
} from '../../states/pages/atoms'
import {
  type Page,
  type PageEditSource,
  type PageInfoForList,
  type PagePresentation,
  type PageType,
  PageTypes,
} from '../../states/pages/types'
import { getTitleToDisplay } from '../i18n'

/**
 * Get whether the width is extra small
 * @returns true if the width is extra small
 */
export const useExtraSmallWidth = (): boolean =>
  useMediaQuery(useTheme().breakpoints.up('sm')) === false

/**
 * Get border color
 * @returns Border color
 */
export const useMaterialUiBorderColor = () =>
  useTheme().palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)'

/**
 * Get latest page titles
 * @returns Latest page title set
 */
export const usePageTitles = (): Set<string> => {
  const pageTitles = useAtomValue(latestPageTitlesAtom)

  return new Set(
    pageTitles
      .map(({ type, title }) => getTitleToDisplay(type, title))
      .filter((title) => 0 < title.length),
  )
}

/**
 * Decide title is usable
 * @param pageTitle Original title
 * @param editingTitle Editing title
 * @returns true if title is usable
 */
export const useUsableTitle = (pageTitle: string, editingTitle: string): boolean => {
  const pageTitles = usePageTitles()

  return (
    0 < editingTitle.length &&
    (pageTitles.has(editingTitle) === false || pageTitle === editingTitle)
  )
}

/**
 * Get FrontPage presentation
 * @returns FrontPage presentation(default value if not exist)
 */
export const useFrontPagePresentation = (): PagePresentation => {
  const { t, i18n } = useTranslation()
  const frontPage = useAtomValue(frontPageAtom)

  return (
    frontPage ?? {
      title: t('FrontPage'),
      language: i18n.language,
      content: t('initialFrontPage'),
    }
  )
}

/**
 * Get SandBox presentation
 * @returns SandBox presentation(default value if not exist)
 */
export const useSandBoxPresentation = (): PagePresentation => {
  const { t, i18n } = useTranslation()
  const sandBox = useAtomValue(sandBoxAtom)

  return (
    sandBox ?? {
      title: t('SandBox'),
      language: i18n.language,
      content: t('initialSandBox'),
    }
  )
}

/**
 * Get page of specified title
 * @param title Page title to get
 * @returns Page date(null if does not exists)
 */
export const usePageWithSpecifiedTitle = (title: string): Page | null =>
  useAtomValue(flattenPageListAtom).find(({ page }) => page?.pageDataHistory[0].title === title)
    ?.page ?? null

/**
 * Get page edit source
 * @param pageTitle Page title
 * @returns Page edit source
 */
export const usePageEditSource = (pageTitle: string): PageEditSource => {
  const { t, i18n } = useTranslation()
  const pageEditSources = useAtomValue(pageEditSourcesAtom)
  let pageEditSource =
    pageEditSources.find(({ pagePresentation }) => pagePresentation?.title === pageTitle) ?? null
  if (pageEditSource === null) {
    switch (pageTitle) {
      case t('FrontPage'):
        pageEditSource = {
          type: PageTypes.FrontPage,
          id: null,
          pagePresentation: {
            title: t('FrontPage'),
            language: i18n.language,
            content: t('initialFrontPage'),
          },
        }
        break

      case t('SandBox'):
        pageEditSource = {
          type: PageTypes.SandBox,
          id: null,
          pagePresentation: {
            title: t('SandBox'),
            language: i18n.language,
            content: t('initialSandBox'),
          },
        }
        break

      default:
        pageEditSource = {
          type: PageTypes.Content,
          id: null,
          pagePresentation: {
            title: pageTitle,
            language: i18n.language,
            content: '',
          },
        }
        break
    }
  }
  return pageEditSource
}

/**
 * Compare page type
 * @param lhs Page type of lhs
 * @param rhs Page type of rhs
 * @returns Compare result
 */
const comparePageTypeOrder = (lhs: PageType, rhs: PageType): number => {
  switch (lhs) {
    case PageTypes.FrontPage:
      return -1
    case PageTypes.SandBox:
      return rhs === PageTypes.FrontPage ? 1 : -1
    default:
      return 0
  }
}

/**
 * Compare page order
 * @param lhsType Page type of lhs
 * @param lhsDateAndTime Date and time of lhs
 * @param rhsType Page type of rhs
 * @param rhsDateAndTime Date and time of rhs
 * @returns Compare result
 */
const comparePageOrder = (
  lhsType: PageType,
  lhsDateAndTime: string | null,
  rhsType: PageType,
  rhsDateAndTime: string | null,
): number => {
  if (lhsDateAndTime === null && rhsDateAndTime === null) {
    return comparePageTypeOrder(lhsType, rhsType)
  }
  if (lhsDateAndTime === null) {
    return -1
  }
  if (rhsDateAndTime === null) {
    return 1
  }
  return lhsDateAndTime.localeCompare(rhsDateAndTime)
}

/**
 * Sort order type
 */
export const SortOrderTypes = {
  /**
   * Create time ascending
   */
  CreateTimeAsc: 'Create time(ascending)',

  /**
   * Create time descending
   */
  CreateTimeDesc: 'Create time(descending)',

  /**
   * Update time descending
   */
  UpdateTimeDesc: 'Update time(descending)',
} as const satisfies Record<string, string>
export type SortOrderType = (typeof SortOrderTypes)[keyof typeof SortOrderTypes]

/**
 * Get page info list
 * @param sortOrder Sort order
 * @returns Page info list
 */
export const useSortedPages = (sortOrder: SortOrderType): PageInfoForList[] =>
  useAtomValue(pageListAtom).toSorted((lhs, rhs) => {
    switch (sortOrder) {
      case SortOrderTypes.CreateTimeAsc:
        return comparePageOrder(lhs.type, lhs.createDateAndTime, rhs.type, rhs.createDateAndTime)
      case SortOrderTypes.CreateTimeDesc:
        return -comparePageOrder(lhs.type, lhs.createDateAndTime, rhs.type, rhs.createDateAndTime)
      case SortOrderTypes.UpdateTimeDesc:
        return -comparePageOrder(
          lhs.type,
          lhs.lastUpdateDateAndTime,
          rhs.type,
          rhs.lastUpdateDateAndTime,
        )
    }
  })
