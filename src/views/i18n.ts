import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

import i18next, { FALLBACK_LNG } from '../i18n'
import { type PageType, PageTypes } from '../states/pages/types'

dayjs.extend(LocalizedFormat)

type OrdinalRuleMap = Record<Intl.LDMLPluralRule, string>

/**
 * Ordinal rules
 */
export const ORDINAL_RULES: Record<string, OrdinalRuleMap> = {
  en: {
    zero: 'th',
    one: 'st',
    two: 'nd',
    few: 'rd',
    other: 'th',
    many: 'th',
  },
} as const

/**
 * Format ordinal
 * @param n Number
 * @param lang Language
 * @returns Formatted ordinal
 */
export const formatOrdinal = (n: number, lang: string) => {
  const pluralRules = new Intl.PluralRules(lang, { type: 'ordinal' })
  const ordinalRule = ORDINAL_RULES[lang]
  return `${n}${ordinalRule[pluralRules.select(n)]}`
}

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
