import { useTranslation } from 'react-i18next'

import { Section } from '../templates/Section'

type PageDiffProps = {
  pageTitle: string
  from: string
  to: string
}

/**
 * Page diff component
 * @param props Props
 * @param props.pageTitle Encoded page title
 * @param props.from Revision number to compare from
 * @param props.to Revision number to compare to
 * @returns JSX Element
 */
export const PageDiff: React.FC<PageDiffProps> = ({ pageTitle, from, to }): JSX.Element => {
  const { t, i18n } = useTranslation()
  const title = decodeURIComponent(pageTitle)

  // TODO: implement validation

  return (
    <Section>
      <h2 lang={i18n.language}>
        {t('Diff between Rev.{{from}} and Rev.{{to}} of “{{title}}”', {
          from,
          to,
          title,
        })}
      </h2>
    </Section>
  )
}
