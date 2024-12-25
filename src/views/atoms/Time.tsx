import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

import { FALLBACK_LNG } from '../../i18n'

dayjs.extend(LocalizedFormat)

type Props = React.ComponentProps<'time'> & {
  dateTime: string
}

/**
 * Time component
 * @param props Props
 * @param props.lang Language
 * @param props.dateTime Date and time(ISO 8601 extended format)
 * @returns JSX Element
 */
export const Time: React.FC<Props> = ({ lang, dateTime }): JSX.Element => (
  <time dateTime={dateTime}>
    {dayjs(dateTime)
      .locale(lang ?? FALLBACK_LNG)
      .format('lll')}
  </time>
)
