import type { NonEmptyArray, Uuid } from '../../types'

/**
 * Page type
 */
export const PageTypes = {
  /**
   * FrontPage
   */
  FrontPage: 'FrontPage',

  /**
   * SandBox
   */
  SandBox: 'SandBox',

  /**
   * Content
   */
  Content: 'Content',
} as const satisfies Record<string, string>
export type PageType = (typeof PageTypes)[keyof typeof PageTypes]

/**
 * Page presentation
 */
export type PagePresentation = {
  /**
   * Language(RFC 5646)
   */
  language: string

  /**
   * Title
   */
  title: string

  /**
   * Content
   */
  content: string
}

/**
 * Page data
 */
export type PageData = PagePresentation & {
  /**
   * Date and time(ISO 8601 extended format with UTC time zone string)
   */
  dateAndTime: string
}

/**
 * Page
 */
export type Page = {
  /**
   * ID(UUIDv4)
   */
  id: Uuid

  /**
   * Page data history
   */
  pageDataHistory: NonEmptyArray<PageData>
}

/**
 * Page set
 */
export type PageSet = {
  /**
   * Front page
   */
  frontPage: Page | null

  /**
   * Sand box
   */
  sandBox: Page | null

  /**
   * Pages
   */
  pages: Page[]
}

/**
 * Page edit source
 */
export type PageEditSource = {
  /**
   * Page type
   */
  type: PageType

  /**
   * ID
   */
  id: Uuid | null

  /**
   * Page presentation
   */
  pagePresentation: PagePresentation | null
}

/**
 * Path type
 */
export const PathTypes = {
  /**
   * FrontPage
   */
  FrontPage: '/',

  /**
   * SandBox
   */
  SandBox: '/SandBox',

  /**
   * NewPage
   */
  NewPage: '/NewPage',

  /**
   * Page list
   */
  Pages: '/pages',

  /**
   * History
   */
  History: '/history',
} as const satisfies Record<string, string>
export type PathType = (typeof PathTypes)[keyof typeof PathTypes]
