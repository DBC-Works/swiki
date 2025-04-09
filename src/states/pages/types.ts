import { type } from 'arktype'

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
export const PageType = type.valueOf(PageTypes)
export type PageType = typeof PageType.infer

/**
 * Page presentation
 */
export const PagePresentation = type({
  /**
   * Language(RFC 5646)
   */
  language: 'string',

  /**
   * Title
   */
  title: 'string',

  /**
   * Content
   */
  content: 'string',
})
export type PagePresentation = typeof PagePresentation.infer

/**
 * Page data
 */
export const PageData = PagePresentation.and({
  /**
   * Date and time(ISO 8601 extended format with UTC time zone string)
   */
  dateAndTime: 'string.date.iso',
})
export type PageData = typeof PageData.infer

/**
 * Page
 */
export const Page = type({
  /**
   * ID(UUIDv4)
   */
  id: 'string.uuid.v4',

  /**
   * Page data history
   */
  pageDataHistory: PageData.array().atLeastLength(1),
})
export type Page = typeof Page.infer

/**
 * Page set
 */
export const PageSet = type({
  /**
   * Front page
   */
  frontPage: Page.or(type.null),

  /**
   * Sand box
   */
  sandBox: Page.or(type.null),

  /**
   * Pages
   */
  pages: Page.array(),
})
export type PageSet = typeof PageSet.infer

/**
 * Page edit source
 */
export const PageEditSource = type({
  /**
   * Page type
   */
  type: PageType,

  /**
   * ID
   */
  id: type.string.or(type.null),

  /**
   * Page presentation
   */
  pagePresentation: PagePresentation.or(type.null),
})
export type PageEditSource = typeof PageEditSource.infer

/**
 * Page info for list
 */
export const PageInfoForList = type({
  /**
   * Page type
   */
  type: PageType,

  /**
   * Page data
   */
  page: PageData.or(type.null),

  /**
   * Create date and time
   */
  createDateAndTime: type.string.or(type.null),

  /**
   * Last update date and time
   */
  lastUpdateDateAndTime: type.string.or(type.null),

  /**
   * Update count
   */
  updateCount: type.number.or(type.null),
})
export type PageInfoForList = typeof PageInfoForList.infer

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
export const PathType = type.valueOf(PathTypes)
export type PathType = (typeof PathTypes)[keyof typeof PathTypes]

/**
 * Data format versions
 */
export const DataFormatVersions = {
  v202503: 202503,
} as const satisfies Record<string, number>
export const DataFormatVersion = type.valueOf(DataFormatVersions)
export type DataFormatVersion = (typeof DataFormatVersions)[keyof typeof DataFormatVersions]
