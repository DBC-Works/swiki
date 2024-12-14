import { type PageType, PageTypes } from '../states/pages/types'

/**
 * Get page browse path
 * @param pageTitle Page title
 * @returns page browse path
 */
export const getPageBrowsePath = (pageTitle: string): string =>
  `/pages/${encodeURIComponent(pageTitle)}`

/**
 * Get specified page browse path
 * @param type Page type
 * @param pageTitle Page title
 * @returns page browse path
 */
export const getSpecifiedPageBrowsePath = (type: PageType, pageTitle: string | null): string => {
  switch (type) {
    case PageTypes.FrontPage:
      return '/'
    case PageTypes.SandBox:
      return '/SandBox'
    default:
      if (pageTitle === null) {
        throw new Error('no page title')
      }
      return getPageBrowsePath(pageTitle)
  }
}
