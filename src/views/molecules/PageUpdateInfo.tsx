import { FALLBACK_LNG } from '../../i18n'
import { Time } from '../atoms/Time'
import { ORDINAL_RULES, formatOrdinal } from '../i18n'

const FORMATTER_MAP: Record<
  string,
  (updateCount: number, dateAndTime: string, lang: string) => JSX.Element
> = {
  en: (updateCount: number, dateAndTime: string, lang: string) => (
    <>
      {formatOrdinal(updateCount, lang)} update on <Time lang={lang} dateTime={dateAndTime} />
    </>
  ),
} as const

type Props = React.ComponentProps<'span'> & {
  dateTime: string
  updateCount: number
}

/**
 * Page update info component
 * @param props Props
 * @param props.lang Language
 * @param props.dateTime Date and time(ISO 8601 extended format)
 * @param props.updateCount Page update count
 * @returns JSX Element
 */
export const PageUpdateInfo: React.FC<Props> = ({ lang, dateTime, updateCount }): JSX.Element => {
  const actualLang = lang && Object.hasOwn(ORDINAL_RULES, lang) ? lang : FALLBACK_LNG
  return <span>{FORMATTER_MAP[actualLang](updateCount, dateTime, actualLang)}</span>
}
