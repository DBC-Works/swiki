import { useTranslation } from 'react-i18next'

/**
 * Revision literal component
 * @param props Props
 * @param props.children Revision no text
 * @returns JSX Element
 */
export const Revision: React.FC<React.ComponentProps<'span'>> = ({ children }): JSX.Element => {
  const { t } = useTranslation()
  return <>{t('Rev.{{revision}}', { revision: children })}</>
}
