import dayjs, { type Dayjs } from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

import i18next, { FALLBACK_LNG } from '../i18n'
import { type PageType, PageTypes } from '../states/pages/types'

dayjs.extend(LocalizedFormat)

type OrdinalRuleMap = Record<Intl.LDMLPluralRule, string>
const ORDINAL_RULES: Record<string, OrdinalRuleMap> = {
  en: {
    zero: 'th',
    one: 'st',
    two: 'nd',
    few: 'rd',
    other: 'th',
    many: 'th',
  },
} as const

const formatOrdinal = (n: number, lang: string) => {
  const pluralRules = new Intl.PluralRules(lang, { type: 'ordinal' })
  const ordinalRule = ORDINAL_RULES[lang]
  return `${n}${ordinalRule[pluralRules.select(n)]}`
}

const FORMATTER_MAP: Record<
  string,
  (updateCount: number, dateAndTime: Dayjs, lang: string) => string
> = {
  en: (updateCount: number, dateAndTime: Dayjs, lang: string) =>
    `${formatOrdinal(updateCount, lang)} update on ${dateAndTime.locale(lang).format('lll')}`,
} as const

/**
 * Get title to display
 * @param type Page type
 * @param title Title of page data
 * @returns Title to display
 */
export const getTitleToDisplay = (type: PageType, title: string | null): string => {
  if (title === null) {
    switch (type) {
      case PageTypes.FrontPage:
        return i18next.t('FrontPage')
      case PageTypes.SandBox:
        return i18next.t('SandBox')
      default:
        return ''
    }
  }
  return title
}

/**
 * Get language
 * @param language Language
 * @returns Language to use
 */
export const getLanguage = (language: string | null): string => language ?? FALLBACK_LNG

/**
 * Format page update info
 * @param lang Language
 * @param dateAndTime Date and time
 * @param updateCount Page update count
 * @returns Formatted string
 */
export const formatPageUpdateInfo = (
  lang: string,
  dateAndTime: Dayjs,
  updateCount: number,
): string => {
  const actualLang = Object.hasOwn(ORDINAL_RULES, lang) ? lang : 'en'
  return FORMATTER_MAP[actualLang](updateCount, dateAndTime, actualLang)
}
