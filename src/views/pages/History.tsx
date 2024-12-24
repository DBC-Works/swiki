import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'

import { pageListAtom } from '../../states/pages/atoms'
import { AddPageFab } from '../atoms/AddPageFab'
import { FabContainer } from '../organisms/FabContainer'
import { PageInfoList } from '../organisms/PageInfoList'
import { Section } from '../templates/Section'

/**
 * History component
 * @returns JSX Element
 */
export const History: React.FC = (): JSX.Element => {
  const { t, i18n } = useTranslation()
  const pages = useAtomValue(pageListAtom).sort(({ page: lhs }, { page: rhs }) => {
    if (lhs === null && rhs === null) {
      return 0
    }
    if (lhs === null) {
      return 1
    }
    if (rhs === null) {
      return -1
    }
    return lhs.dateAndTime < rhs.dateAndTime ? 1 : -1
  })

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
