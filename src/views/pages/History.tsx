import { useTranslation } from 'react-i18next'

import { AddPageFab } from '../atoms/AddPageFab'
import { SortOrderTypes, useSortedPages } from '../hooks/hooks'
import { FabContainer } from '../organisms/FabContainer'
import { PageInfoList } from '../organisms/PageInfoList'
import { Section } from '../templates/Section'

/**
 * History component
 * @returns JSX Element
 */
export const History: React.FC = (): JSX.Element => {
  const { t, i18n } = useTranslation()
  const pages = useSortedPages(SortOrderTypes.UpdateTimeDesc)

  return (
    <Section>
      <h2 lang={i18n.language}>{t('History')}</h2>
      <PageInfoList pages={pages} />
      <FabContainer>
        <AddPageFab />
      </FabContainer>
    </Section>
  )
}
