import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'

import {
  frontPageAtom,
  latestPageTitlesAtom,
  pageEditSourcesAtom,
  sandBoxAtom,
} from '../../states/pages/atoms'
import { type PageEditSource, type PagePresentation, PageTypes } from '../../states/pages/types'
import { getTitleToDisplay } from '../i18n'

/**
 * Get latest page titles hook
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
